import { flow, pipe } from "fp-ts/lib/function";
import { map as injectDeps } from "fp-ts/lib/Reader";
import { find } from "../Find";
import { UUID } from "../../../Shared/Domain/UUID";
import { map as whenSearchFinish } from 'fp-ts/Task';
import { AccountCreated } from "../../Domain/AccountCreated";
import * as O from 'fp-ts/Option';
import * as E from 'fp-ts/Either';
import { mutationUseCase } from "../../../Shared/Domain/UseCase";

export const create = mutationUseCase((accountId: string) => pipe(
    searchAccountExists(accountId), 
    injectDeps(whenSearchFinish(accountAlreadyExists => 
      accountAlreadyExists
      ? noAfectation
      : createAccount(accountId)
    ))
  ))

const exists = whenSearchFinish(O.isSome)

const searchAccountExists = flow(
  find, 
  injectDeps(exists), 
)

const createAccount = flow(
  UUID, 
  E.map(AccountCreated), 
  E.map(O.some)
)

const noAfectation = E.right(O.none)