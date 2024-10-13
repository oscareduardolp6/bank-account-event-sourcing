import { pipe } from 'fp-ts/function'
import { call as applyTask } from '../../../src/Bank/Shared/Domain/TaskExt'
import * as O from 'fp-ts/Option'
import * as TO from 'fp-ts/TaskOption' 
import * as T from 'fp-ts/Task'
import { expectTrue, throwError } from './jestFns'

export const assertOverAsyncOptionalValue = <Value>(assertOverValue: (value: Value) => void) => 
(result: TO.TaskOption<Value>) => pipe(
  result, 
  T.map(O.match(throwError, assertOverValue)), 
  applyTask
)

export const assertAsyncOptionValueIs = <T>(expectedValue: T) => 
  assertOverAsyncOptionalValue<T>(actualValue => expect(actualValue).toBe(expectedValue))

export const assertAsyncOptionalIsNotNone = <T>(result: TO.TaskOption<T>) => pipe(
  result, 
  T.map(O.match(throwError, expectTrue)), 
  T.asUnit, 
  applyTask
)

export const assertAsyncOptionalIsNone = <T>(result: TO.TaskOption<T>) => pipe(
  result, 
  T.map(O.match(expectTrue, throwError)), 
  T.asUnit, 
  applyTask
)