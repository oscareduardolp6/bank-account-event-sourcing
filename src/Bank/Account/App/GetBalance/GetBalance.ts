import * as UUID from '../../../Shared/Domain/UUID'
import * as E from 'fp-ts/Either'
import { pipe } from "fp-ts/function";
import { Find } from "../../Domain/AccountRepository";
import { find } from '../Find';

type GetBalanceDeps = {
}

export const getBalance = (id: string) => (deps: GetBalanceDeps) => pipe(
  find(id), 
)