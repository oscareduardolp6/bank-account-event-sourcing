import { EventBus } from "../../Shared/Domain/EventBus";
import { Repository } from "../../Shared/Domain/Repository";
import { Account, AccountEvent } from "../Domain/Account";
import { AccountSearcher } from "./AccountSearcher";
import { isSome as exists } from 'fp-ts/Option'
import { isLeft as isInvalid, of } from 'fp-ts/Either'
import { getData } from "../../Shared/Domain/Either";
import { constVoid } from "fp-ts/function";

export class AccountCreator {
  constructor(
    private readonly repository: Repository<Account, AccountEvent>, 
    private readonly eventBus: EventBus, 
    private readonly searcher: AccountSearcher) {} 

  async create(id: string) {
    const searchedAccount = await this.searcher.search(id)
    if(exists(searchedAccount)) return of(constVoid())
    const accountCreation = Account.create(id) 
    if(isInvalid(accountCreation)) return accountCreation
    const account = getData(accountCreation) 
    for (const event of account.pullDomainEvents()) {
      await this.repository.apply(event) 
      await this.eventBus.publish(event)
    }
    return of(constVoid())
  }
}