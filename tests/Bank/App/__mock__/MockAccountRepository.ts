import { Account } from "../../../../src/Bank/domain/Account";
import { AccountRepository } from "../../../../src/Bank/domain/AccountRepository";
import { DomainEvent } from "../../../../src/Shared/Domain/DomainEvent";
import { UUID } from "../../../../src/Shared/Domain/UUID";
import { getArgumentOfCall, getNumberOfCalls } from "../../Shared/Infrastructure/jestFunctions";

export class MockAccountRepository implements AccountRepository {
  private applyMock: jest.Mock 
  private loadMock: jest.Mock

  constructor() {
    this.applyMock = jest.fn()
    this.loadMock = jest.fn()
  }

  async load(id: UUID): Promise<Account> {
    return this.loadMock(id)
  }

  returnAccountOnLoad(account: Account) {
    this.loadMock.mockReturnValueOnce(account)
  }

  async apply<T>(event: DomainEvent<T>): Promise<void> {
    this.applyMock(event)
  }

  assertApplyHaveBeenCalledOnce() {
    expect(getNumberOfCalls(this.applyMock)).toBe(1)
  }

  assertApplyHaveBeenCalledWith<T>(expectedEvent: DomainEvent<T>) {
    const called = getArgumentOfCall(this.applyMock, 1)
    expect(expectedEvent.equals(called))
  }
}