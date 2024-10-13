import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import { AccountCreated } from "./AccountCreated";
import { DepositMade } from "./DepositMade";

export type AccountBalance = number & { type: 'AccountBalance'}

export type AccountEvent = 
  AccountCreated 
  | DepositMade

export type Account = NonEmptyArray.NonEmptyArray<AccountEvent>

const DEFAULT_INITIAL_BALANCE = 0 as AccountBalance 

export const calculateBalance = (account: Account) => account
  .reduce((balance, event) => {
    switch(event.name) {
      case 'account.created': return balance as AccountBalance
      case 'account.deposited': return balance + event.data.ammount as AccountBalance
    }
  }, DEFAULT_INITIAL_BALANCE)
