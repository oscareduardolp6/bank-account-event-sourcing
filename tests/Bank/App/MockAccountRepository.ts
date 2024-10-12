import { Option } from "fp-ts/lib/Option";
import { Account, AccountEvent } from "../../../src/Context/Bank/Domain/Account";
import { Repository } from "../../../src/Context/Shared/Domain/Repository";
import { UUID } from "../../../src/Context/Shared/Domain/UUID";
import { getArgumentOfCall, getNumberOfCalls } from "../../Shared/Domain/jestFns";
import * as O from 'fp-ts/Option'

export class MockAccountRepository implements Repository<Account, AccountEvent> {
  private loadMock: jest.Mock 
  private applyMock: jest.Mock

  constructor() {
    this.loadMock = jest.fn()
    this.applyMock = jest.fn()
  }


  async load(id: UUID): Promise<Option<Account>> {
    const result = this.loadMock(id)
    return result ?? O.none
  }

  async apply(event: AccountEvent): Promise<void> {
    this.applyMock(event)
  }

  returnOnLoad(account: Account) {
    this.loadMock.mockReturnValueOnce(O.of(account))
  }

  assertApplyHasBeenCalledWith(expectedEvent: AccountEvent) {
    const calledEvent = getArgumentOfCall(this.applyMock) 
    expect(expectedEvent.equals(calledEvent))
  }

  assertApplyHasBeenCalledOnlyOnce() {
    expect(getNumberOfCalls(this.applyMock)).toBe(1)
  }

}