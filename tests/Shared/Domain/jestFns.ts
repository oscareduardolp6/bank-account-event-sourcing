import { flow, pipe } from "fp-ts/function"
import { call as applyTask } from "../../../src/Bank/Shared/Domain/TaskExt"
import { isRight as isCorrect } from "fp-ts/Either"
import * as TE from 'fp-ts/TaskEither'
import * as TO from 'fp-ts/TaskOption'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'

export function getNumberOfCalls(mock: jest.Mock) {
  return mock.mock.calls.length
}

export function getArgumentOfCall(mock: jest.Mock, callNum = 1){
  return mock.mock.calls[callNum - 1][0]
}

export const assertMockHasBeenCalledOnlyOnce = flow(
  getNumberOfCalls, 
  numberOfCalls => expect(numberOfCalls).toBe(1)
)

export const assertMockHasNotBeenCalled = flow(
  getNumberOfCalls, 
  numberOfCalls => expect(numberOfCalls).toBe(0)
)

export const assertAsyncOptionalIsNone = <Val>(to: TO.TaskOption<Val>) => pipe(
  to, 
  T.map(option => expect(O.isNone(option))), 
  T.asUnit, 
  applyTask
)

export const assertAsyncOptionalIsNotNone = <Val>(to: TO.TaskOption<Val>) => pipe(
  to, 
  T.map(O.isSome), 
  T.map(expect)
)

export const assertAsyncOptionValueIs = <T>(expectedValue: T) => (to: TO.TaskOption<T>) => pipe(
  to, 
  TO.match(
    () => { throw new Error('The value was none')}, 
    actualValue => expect(actualValue).toBe(expectedValue)
  ), 
  applyTask
)

export const assertOverAsyncOptionalValue = <Value>(assertOverValue: (value: Value) => void) => 
(result: TO.TaskOption<Value>) => pipe(
  result, 
  TO.map(assertOverValue),
  T.asUnit, 
  applyTask
)

export const assertAsyncResultIsCorrect = flow(
  T.map(flow(isCorrect, expect)), 
  T.asUnit, 
  applyTask
)

export const assertOverFailedAsyncResult = <PossibleError>(assertOverError: (error: PossibleError) => void) => 
  (result: TE.TaskEither<PossibleError, void>) => pipe(
  result, 
  TE.mapLeft(assertOverError), 
  T.asUnit, 
  applyTask
)