import { flow, pipe } from "fp-ts/lib/function";
import { find } from "../Find";
import { DepositMade } from "../../Domain/DepositMade";
import { AccountNotFound } from "../../Domain/AccountNotFound";
import { DepositAmmount } from "../../Domain/DepositAmmount";
import * as E from 'fp-ts/Either';
import * as TE from 'fp-ts/TaskEither';
import * as O from 'fp-ts/Option';
import { mutationUseCase } from "../../../Shared/Domain/UseCase";

export const deposit = mutationUseCase((payload: DepositMade['data']) => flow(
  find(payload.accountId), 
  TE.fromTaskOption(() => AccountNotFound(payload.accountId)), 
  TE.flatMapEither(_account => pipe(
    DepositAmmount(payload.ammount), 
    E.map(_ammount => DepositMade(payload)), 
    E.map(O.of), 
  )),
))