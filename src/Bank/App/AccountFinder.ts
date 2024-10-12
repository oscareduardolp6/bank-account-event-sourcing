import { UUID } from "../../Shared/Domain/UUID";
import { Account } from "../domain/Account";
import { AccountRepository } from "../domain/AccountRepository";


export class AccountSearcher {
  constructor(private readonly repository: AccountRepository) {}

  async search(id: string): Promise<Account | null> {
    const accountId = new UUID(id) 
    const account = await this.repository.load(accountId)
    return account
  }
}