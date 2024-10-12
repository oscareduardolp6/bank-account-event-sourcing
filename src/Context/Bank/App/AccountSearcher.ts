import { getData } from "../../Shared/Domain/Either";
import { Repository } from "../../Shared/Domain/Repository";
import { UUID } from "../../Shared/Domain/UUID";
import { Account, AccountEvent } from "../Domain/Account";
import { isLeft as isInvalid } from 'fp-ts/Either';
import * as O from 'fp-ts/Option';

export class AccountSearcher {
  constructor(private readonly repository: Repository<Account, AccountEvent>) {} 

  async search(id: string): Promise<O.Option<Account>> {
    const idValidation = UUID(id)
    if(isInvalid(idValidation)) return O.none
    const accountId = getData(idValidation) 
    return await this.repository.load(accountId)
  }
}
