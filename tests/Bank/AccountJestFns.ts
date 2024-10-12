import { pipe } from "fp-ts/lib/function";
import { getArgumentOfCall } from "../Shared/Domain/jestFns";
import { AccountEvent } from "../../src/Bank/Account/Domain/Account";

export const assertMockHasBeenCalledWith = (mock: jest.Mock, expectedEvent: AccountEvent, equals: (val1: AccountEvent, val2: AccountEvent) => boolean) => pipe(
  getArgumentOfCall(mock), 
  calledEvent => expect(equals(calledEvent, expectedEvent)), 
)