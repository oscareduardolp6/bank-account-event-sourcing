import * as NonEmptyArray from "fp-ts/lib/NonEmptyArray";
import { AccountCreated } from "./AccountCreated";
import { DepositMade } from "./DepositMade";

export type AccountEvent = 
  AccountCreated 
  | DepositMade

export type Account = NonEmptyArray.NonEmptyArray<AccountEvent>

export const getBalance = (account: Account): number => 0
