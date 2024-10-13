import { fromEither, flatMap as andThen } from "fp-ts/lib/TaskOption";
import { flow, pipe } from "fp-ts/lib/function";
import { Load } from "../../../Shared/Domain/Load";
import * as domain_UUID from "../../../Shared/Domain/UUID";
import { Account } from "../../Domain/Account";

export const find = (id: string) => ({ find: findInDb }: FindDeps) => pipe(
    parseToUUID(id), 
    andThen(findInDb), 
  )

export type FindDeps = {
  find: Load<Account>
}

const parseToUUID = flow(domain_UUID.UUID, fromEither)