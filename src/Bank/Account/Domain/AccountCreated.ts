import { DomainEvent } from "../../Shared/Domain/DomainEvent";
import { UUID } from "../../Shared/Domain/UUID";

export interface AccountCreated extends DomainEvent {
  name: 'AccountCreated';
  data: { accountId: string; };
}

export const AccountCreated = (accountId: UUID): AccountCreated => ({
  name: 'AccountCreated', 
  aggregateId: accountId, 
  data: { accountId }, 
  occurredOn: new Date()
})
