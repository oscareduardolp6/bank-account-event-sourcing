import { call as applyTask } from '../../../src/Bank/Shared/Domain/TaskExt'
import { pipe } from 'fp-ts/function'
import { expectTrue, throwError } from './jestFns'
import * as TE from 'fp-ts/TaskEither' 
import * as T from 'fp-ts/lib/Task' 


export const assertOverAsyncResult = <L, R>(assertOverFail: (te: L) => void, assertOverValue: (te: R) => void,) => 
  (result: TE.TaskEither<L,R>) => pipe(
    result, 
    TE.match(assertOverFail, assertOverValue), 
    applyTask
  )

export const assertAsyncResultIsCorrect = <L,R>(te: TE.TaskEither<L,R>) => pipe(
  te, 
  assertOverAsyncResult(throwError, expectTrue)
)

export const assertAsyncResultIsIncorrect = <L,R>(te: TE.TaskEither<L,R>) => pipe(
  te, 
  assertOverAsyncResult(expectTrue, throwError)
)

export const assertOverFailedAsyncResult = <PossibleError>(assertOverError: (error: PossibleError) => void) => 
  (result: TE.TaskEither<PossibleError, void>) => pipe(
  result, 
  assertOverAsyncResult(assertOverError, throwError)
)