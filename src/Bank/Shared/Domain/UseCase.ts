import { constVoid, identity, pipe } from "fp-ts/function"
import { Apply } from "./Apply"
import { Publish } from "./Publish"
import * as T from 'fp-ts/Task'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { DomainEvent } from "./DomainEvent"
import { Do as initDI, bind, asks as inject, map, Reader } from 'fp-ts/Reader'


/**
 * Se encarga de guardar los eventos en la event Store y de mandarlos al event bus, evita que el desarrollador tenga que hacer 
 * esos pasos o que pueda olvidarlos
 * @param mutation El Caso de Uso, el caso de uso debe devolver un Evento de Dominio
 * @returns 
 */
export const mutationUseCase = <Input, Deps, Error, MyEvent extends DomainEvent>(mutation: Mutation<Input, Deps & UseCaseDeps, Error, MyEvent>) => (args: Input) => pipe(
  initDI, 
  bind('mutation', () => mutation(args)), 
  bind('apply', () => inject(distributeEvent)), 
  map(({ apply, mutation }) => pipe(
    mutation, 
    TE.map(O.map(apply)), 
    TE.map(O.match(voidTask, identity)), 
    TE.flatMapTask(identity), 
  )), 
)

export type MutativeUseCase<Input, Deps, Error> = (args: Input) => Reader<Deps & UseCaseDeps, TE.TaskEither<Error, void>>

type Mutation<Input, Deps, Error, MyEvent> = (args: Input) => Reader<Deps, T.Task<E.Either<Error, O.Option<MyEvent>>>> 

export type UseCaseDeps = {
  apply: Apply
  publish: Publish
}

const voidTask = () => T.of(constVoid())

const distributeEvent = <T extends DomainEvent>({ apply, publish }: UseCaseDeps) => (event: T) => () =>
  apply(event)
  .then(() => publish(event))