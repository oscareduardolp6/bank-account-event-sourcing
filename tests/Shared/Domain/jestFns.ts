import { flow, pipe } from "fp-ts/function"
import { DomainEvent } from "../../../src/Bank/Shared/Domain/DomainEvent"

export const throwError = <T>(error?: T) => { 
  const err = error ?? new Error('None value') 
  throw err
}

export const expectTrue = () => expect(true)

export function getNumberOfCalls(mock: jest.Mock) {
  return mock.mock.calls.length
}

export function getArgumentOfCall(mock: jest.Mock, callNum = 1){
  return mock.mock.calls[callNum - 1][0]
}

export const assertMockHasBeenCalledWith = <AggregateEvent extends DomainEvent>(mock: jest.Mock, expectedEvent: AggregateEvent, equals?: (a1: AggregateEvent, a2: AggregateEvent) => boolean) => {
  const actualEvent = getArgumentOfCall(mock)
  if(!equals) return expect(actualEvent).toBe(expectedEvent)
  return expect(equals(expectedEvent, actualEvent))
}

export const assertMockHasBeenCalledOnlyOnce = flow(
  getNumberOfCalls, 
  numberOfCalls => expect(numberOfCalls).toBe(1)
)

export const assertMockHasNotBeenCalled = flow(
  getNumberOfCalls, 
  numberOfCalls => expect(numberOfCalls).toBe(0)
)