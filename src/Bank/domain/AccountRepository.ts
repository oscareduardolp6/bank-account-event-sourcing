import { DomainEvent } from "../../Shared/Domain/DomainEvent";
import { UUID } from "../../Shared/Domain/UUID";
import { Account, AccountDomainEvent } from "./Account";

export interface AccountRepository {
  load(id: UUID): Promise<Account>
  apply(event: AccountDomainEvent): Promise<void>
}