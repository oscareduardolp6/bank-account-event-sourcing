import { flow, pipe } from 'fp-ts/lib/function'
import { create } from '../Create'
import { deposit } from '../Deposit/Deposit'
import { sequenceS } from 'fp-ts/lib/Apply'
import * as UUID from '../../../Shared/Domain/UUID'
import * as R from 'fp-ts/Reader'
import { InMemoryRepository } from '../../../Shared/Infrastructure/InMemoryRepository'
import { withdraw } from './Withdraw'
import { assertAsyncResultIsCorrect, assertOverAsyncResult } from '../../../../../tests/Shared/Domain/jestTaskEitherFns'
import { throwError } from '../../../../../tests/Shared/Domain/jestFns'
import { getBalance } from '../GetBalance'
import { assertAsyncOptionValueIs } from '../../../../../tests/Shared/Domain/jestTaskOptionFns'
import { AccountBalance } from '../../Domain/Account'

describe('Withdraw to an Account', () => {
  let publish: jest.Mock
  let testDeps;

  beforeEach(() => {
    const repository = new InMemoryRepository()
    testDeps = {
      apply: repository.apply.bind(repository), 
      find: repository.load.bind(repository), 
      publish: jest.fn()
    }

  })

  it('should withdraw without error', async () => {
    const accountId = UUID.random()

    const enviromentPreparation = pipe(
      {
        creation: create(accountId ), 
        deposit: deposit({ accountId, ammount: 100 }), 
      }, 
      sequenceS(R.Applicative)
    )(testDeps) 

    await enviromentPreparation.creation()
    await enviromentPreparation.deposit() 

    const checkWithdrawIsCorrect = flow(
      withdraw({ accountId, ammount: 50 }), 
      assertAsyncResultIsCorrect
    )

    await checkWithdrawIsCorrect(testDeps)

    const checkTheExpectedBalance = flow(
      getBalance(accountId), 
      assertAsyncOptionValueIs<AccountBalance>(50 as AccountBalance)
    )

    await checkTheExpectedBalance(testDeps)
  })

})