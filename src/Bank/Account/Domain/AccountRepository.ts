import { TaskOption } from "fp-ts/lib/TaskOption";
import { UUID } from "../../Shared/Domain/UUID";
import { Account } from "./Account";

export type Find = (accountId: UUID) => TaskOption<Account>