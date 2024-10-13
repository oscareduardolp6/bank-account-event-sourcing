import { flow } from "fp-ts/function";
import { map as ifAccountExists } from 'fp-ts/TaskOption';
import { find } from '../Find';
import { calculateBalance } from '../../Domain/Account';

export const getBalance = (id: string) => flow(
  find(id), 
  ifAccountExists(calculateBalance)
)