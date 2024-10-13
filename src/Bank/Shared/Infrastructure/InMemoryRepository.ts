import { pipe } from 'fp-ts/lib/function'
import { Apply } from '../Domain/Apply'
import { DomainEvent } from '../Domain/DomainEvent'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as T from 'fp-ts/Task'
import { UUID } from '../Domain/UUID'

let events: DomainEvent[] = []

export const clear = () => {
  events = []
}

export const apply: Apply = async <T extends DomainEvent>(event: T) => {
  events.push(event)
}

export const load = <AggregateEvent extends DomainEvent>(aggregateId: UUID) => pipe(
  (events
  .filter(event => event.aggregateId === aggregateId) as AggregateEvent[]), 
  NEA.fromArray, 
  T.of, 
) 
