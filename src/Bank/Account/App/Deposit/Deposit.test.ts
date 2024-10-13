import { Account } from '../../Domain/Account';
import { Apply } from '../../../Shared/Domain/Apply';
import { Publish } from '../../../Shared/Domain/Publish';
import { Load } from '../../../Shared/Domain/Load';
import { InMemoryRepository } from '../../../Shared/Infrastructure/InMemoryRepository';
import { flow, pipe } from 'fp-ts/lib/function';
import { create } from '../Create';
import { deposit } from './Deposit';
import { sequenceS } from 'fp-ts/lib/Apply';
import * as UUID from '../../../Shared/Domain/UUID'
import * as R from 'fp-ts/Reader'
import { getBalance } from '../GetBalance';
import { assertAsyncOptionValueIs } from '../../../../../tests/Shared/Domain/jestTaskOptionFns';

type TestDeps = { apply: Apply, find: Load<Account>, publish: Publish }
type Deps = TestDeps & Record<keyof TestDeps, jest.Mock> 


describe('Deposit to an Account', () => {
  let publish: jest.Mock;
  let testDeps: Deps 

  beforeEach(() => {
    const repository = new InMemoryRepository()

    testDeps = {
      apply: repository.apply.bind(repository),
      find: repository.load.bind(repository), 
      publish: jest.fn()
    } 
  })

  it('should deposit without error', async () => {
    const accountId = UUID.random()

    const enviromentPreparation = pipe(
      {
        creation: create(accountId), 
        deposit1: deposit({ accountId, ammount: 50 }), 
        deposit2: deposit({ accountId, ammount: 100 })
      }, 
      sequenceS(R.Applicative), 
    )(testDeps)

    await enviromentPreparation.creation()
    await enviromentPreparation.deposit1()
    await enviromentPreparation.deposit2()

    const checkAccountBalanceIsCorrectUsing = flow(
      getBalance(accountId), 
      assertAsyncOptionValueIs(150)
    )

    await checkAccountBalanceIsCorrectUsing(testDeps)

  })

  it('should fail with negative ammount', async () => {
  })

})
