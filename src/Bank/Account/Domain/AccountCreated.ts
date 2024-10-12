import { struct } from "fp-ts/Eq";
import { createEq, DomainEvent } from "../../Shared/Domain/DomainEvent";
import { UUID } from "../../Shared/Domain/UUID";
import { Eq as eqString } from 'fp-ts/string'
import { flow } from "fp-ts/function";

export interface AccountCreated extends DomainEvent {
  name: 'account.created';
  data: { accountId: string; };
}

export const AccountCreated = (accountId: UUID): AccountCreated => ({
  name: 'account.created', 
  aggregateId: accountId, 
  data: { accountId }, 
  occurredOn: new Date()
})

const dataEq = struct<AccountCreated['data']>({
  accountId: eqString
})

export const equals = flow(createEq(dataEq).equals)
