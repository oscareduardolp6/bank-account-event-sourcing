import * as UUID from '../../../Shared/Domain/UUID'
import { InMemoryRepository } from '../../../Shared/Infrastructure/InMemoryRepository'
import { Account, AccountBalance } from '../../Domain/Account'
import { flow, pipe } from 'fp-ts/lib/function'
import { getBalance } from './GetBalance'
import { create } from '../Create/Create'
import { deposit } from '../Deposit/Deposit'
import { Applicative } from 'fp-ts/Reader'
import { sequenceS } from 'fp-ts/lib/Apply'
import { Apply } from '../../../Shared/Domain/Apply'
import { Load } from '../../../Shared/Domain/Load'
import { Publish } from '../../../Shared/Domain/Publish'
import { assertAsyncOptionalIsNone, assertAsyncOptionValueIs } from '../../../../../tests/Shared/Domain/jestTaskOptionFns'

type Deps = {
  apply: Apply, 
  find: Load<Account>, 
  publish: Publish
}

describe('Get Balance of an Account', () => {
  let deps: Deps; 

  beforeEach(() => {
    const repository = new InMemoryRepository()
    deps = {
      apply: repository.apply.bind(repository), 
      find: repository.load.bind(repository), 
      publish: jest.fn()
    }

  })

  it('should return none if the account does not exists', async () => {
    const executeTestWith = flow(
      getBalance(UUID.random()),
      assertAsyncOptionalIsNone
    )
    await executeTestWith(deps)
  })

  it('should sum all the deposits', async () => {
    const accountId = UUID.random(), 
          ammount1 = 50, 
          ammount2 = 50, 
          expectedBalance = 100 as AccountBalance

    const arrangeMutations = pipe({
      creation: create(accountId), 
      deposit1: deposit({ accountId, ammount: ammount1 }), 
      deposit2: deposit({ accountId, ammount: ammount2 })
    }, sequenceS(Applicative))

    const checkTheExpectedBalance = flow(
      getBalance(accountId), 
      assertAsyncOptionValueIs(expectedBalance), 
    )

    const arrange = arrangeMutations(deps)

    await arrange.creation()
    await arrange.deposit1()
    await arrange.deposit2()
    await checkTheExpectedBalance(deps)

  })

  it('should return 0 for just created account', async () => {
    const accountId = UUID.random(), 
          creationWith = create(accountId), 
          creation = creationWith(deps); 

    const checkBalanceIs0With = flow(
      getBalance(accountId), 
      assertAsyncOptionValueIs(0), 
    )

    await creation()
    await checkBalanceIs0With(deps)
  })

})