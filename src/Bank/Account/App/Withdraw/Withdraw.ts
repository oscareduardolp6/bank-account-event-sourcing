import { flow, pipe } from "fp-ts/lib/function";
import { WithdrawnAmmount } from "../../Domain/WithdrawnAmmount";
import { find } from "../Find";
import { AccountNotFound } from "../../Domain/AccountNotFound";
import { InsuficientFunds } from "../../Domain/InsuficientFunds";
import * as Account from '../../Domain/Account'
import * as TE from 'fp-ts/TaskEither'
import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import { mutationUseCase } from "../../../Shared/Domain/UseCase";

export const withdraw = mutationUseCase((payload: WithdrawnAmmount['data']) => flow(
  find(payload.accountId), 
  TE.fromTaskOption(() => AccountNotFound(payload.accountId)), 
  TE.flatMapEither(account => pipe(
    account, 
    Account.calculateBalance, 
    E.fromPredicate(
      balance => balance >= payload.ammount, 
      (balance) => InsuficientFunds({ ammount: payload.ammount, balance  })
    ), 
    E.map(_balance => O.of(WithdrawnAmmount(payload))),
  )),
))