import { EventBus } from "../../Shared/Domain/Eventbus";
import { Account } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";
import { AccountSearcher } from "./AccountFinder";

export class AccountCreator {

  constructor(
    private readonly repository: AccountRepository, 
    private readonly eventBus: EventBus, 
    private readonly accountSearcher: AccountSearcher
  ) {}

  async create(accountId: string) {
    const existingAccount = await this.accountSearcher.search(accountId) 
    if(existingAccount) return
    for (const event of Account.create(accountId).pullDomainEvents()) {
      await this.repository.apply(event)
      await this.eventBus.publish(event)
    }
  }

}