import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";
import { UUID } from "../../Shared/Domain/UUID";
import { AccountCreated } from "./AccountCreated";

export type AccountDomainEvent = AccountCreated

export class Account extends AggregateRoot<AccountDomainEvent> {
  readonly accountId: UUID

  private constructor(accountId: UUID) {
    super()
    this.accountId = accountId
  }

  static create(id: string) {
    const accountId = new UUID(id) 
    const account = new Account(accountId)
    const accountCreated = AccountCreated.create(id)
    account.record(accountCreated)
    return account
  }
}
