import { Eq as eqString } from 'fp-ts/string';
import { Eq as eqNum } from 'fp-ts/number';
import { struct } from "fp-ts/lib/Eq";
import { createEq, DomainEvent } from "../../Shared/Domain/DomainEvent";

export interface DepositMade extends DomainEvent {
  name: 'account.deposited'
  data: { 
    accountId: string
    ammount: number
  }
}

export const DepositMade = (payload: DepositMade['data']): DepositMade => ({
  aggregateId: payload.accountId, 
  data: payload, 
  name: 'account.deposited', 
  occurredOn: new Date()
})

const dataEq = struct<DepositMade['data']>({
  accountId: eqString, 
  ammount: eqNum
})

export const equals = createEq(dataEq).equals