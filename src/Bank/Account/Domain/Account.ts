import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { AccountCreated } from "./AccountCreated";

export type AccountEvent = AccountCreated 

export type Account = NonEmptyArray<AccountEvent>
