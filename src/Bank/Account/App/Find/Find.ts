import { fromEither, flatMap as andThen } from "fp-ts/lib/TaskOption";
import { flow, pipe } from "fp-ts/lib/function";
import * as domain_UUID from "../../../Shared/Domain/UUID";
import * as AccountRepository from '../../Domain/AccountRepository';


export const find = (id: string) => ({ find: findInDb }: FindDeps) => pipe(
    parseToUUID(id), 
    andThen(findInDb) 
  )

export type FindDeps = {
  find: AccountRepository.Find
}

const parseToUUID = flow(domain_UUID.UUID, fromEither)