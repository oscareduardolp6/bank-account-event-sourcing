import { AggregateRoot } from "../../Shared/Domain/AggregateRoot";
import { DomainEvent } from "../../Shared/Domain/DomainEvent";
import { UUID } from "../../Shared/Domain/UUID";
import { isLeft as isInvalid, of } from 'fp-ts/Either'
import { AccountCreated } from "./AccountCreated";
import { getData } from "../../Shared/Domain/Either";

export type AccountEvent = DomainEvent<null>

export class Account extends AggregateRoot<AccountEvent> {

  private constructor(readonly id: UUID) {
    super()
  }

  static create(id: string) {
    const idValidation = UUID(id)
    if(isInvalid(idValidation)) return idValidation
    const accountId = getData(idValidation)
    const account = new Account(accountId)
    account.record(AccountCreated.create(accountId))
    return of(account)
  }
}

