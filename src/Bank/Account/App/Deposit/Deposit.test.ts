import { flow } from 'fp-ts/function';
import { deposit } from './Deposit';
import { DepositMade, equals } from '../../Domain/DepositMade';
import { AccountCreated } from '../../Domain/AccountCreated';
import { Account } from '../../Domain/Account';
import { assertMockHasBeenCalledWith } from '../../../../../tests/Bank/AccountJestFns';
import { isNumberNotPositive, NumberNotPositive } from '../../../Shared/Domain/PositiveNumber/NumberNotPositive';
import { assertAsyncResultIsCorrect, assertMockHasNotBeenCalled, assertOverFailedAsyncResult } from '../../../../../tests/Shared/Domain/jestFns';
import { Apply } from '../../../Shared/Domain/Apply';
import { Publish } from '../../../Shared/Domain/Publish';
import { AccountNotFound, isAccountNotFound } from '../../Domain/AccountNotFound';
import * as UUID from '../../../Shared/Domain/UUID';
import * as TO from 'fp-ts/TaskOption';
import { Load } from '../../../Shared/Domain/Load';

type TestDeps = { apply: Apply, find: Load<Account>, publish: Publish }
type Deps = TestDeps & Record<keyof TestDeps, jest.Mock> 


describe('Deposit to an Account', () => {
  let apply: jest.Mock, 
      find: jest.Mock, 
      publish: jest.Mock;
  let testDeps: Deps 
  let mocks: jest.Mock[]; 

  beforeEach(() => {
    apply = jest.fn()
    find = jest.fn()
    publish = jest.fn()

    testDeps = {
      apply, 
      find,
      publish
    } 

    mocks = [apply, publish]
  })

  it('should deposit without error', async () => {
    const accountId = UUID.random(),
          ammount = 100, 
          depositEvent = DepositMade({ accountId, ammount }), 
          createEvent = AccountCreated(accountId), 
          account: Account = [createEvent, depositEvent]

    configureMockCorrectReturnValues({ ...testDeps , account });

    const executeTestWith = flow(
      deposit({ accountId, ammount}),
      assertAsyncResultIsCorrect
    )

    await executeTestWith(testDeps)

    mocks
      .forEach(mock => assertMockHasBeenCalledWith(mock, depositEvent, equals))
  })

  it('should fail with negative ammount', async () => {
    const accountId = UUID.random(),
          ammount = -20, 
          depositEvent = DepositMade({ accountId, ammount }), 
          createdEvent = AccountCreated(accountId); 
    const account: Account = [createdEvent, depositEvent] 

    configureMockCorrectReturnValues({ ...testDeps, account })

    const executeTestWith = flow(
      deposit({ accountId, ammount }), 
      assertErrorToBeNumberNotPositiveWithValue(ammount)
    )

    await executeTestWith(testDeps)

    mocks.forEach(assertMockHasNotBeenCalled)
  })

  it('should fail with non existing Account', async () => {
    const accountId = UUID.random(), 
          ammount = 100; 

    configureMockNonExistingAccount(find)

    const executeTestWith = flow(
      deposit({ accountId, ammount }), 
      assertErrorToBeAccountNotFoundWithId(accountId)
    )

    await executeTestWith(testDeps) 

    mocks.forEach(assertMockHasNotBeenCalled)
  })

})

const expectErrorToBeAccountNotFoundWithId_ = (val: string) =>  (error: NumberNotPositive | AccountNotFound) => {
  expect(isAccountNotFound(error))
  const accountNotFoundError = error as AccountNotFound
  expect(accountNotFoundError.data.accountId).toBe(val)
}

const assertErrorToBeAccountNotFoundWithId = flow(
  expectErrorToBeAccountNotFoundWithId_, 
  assertOverFailedAsyncResult
)

const expectErrorTobeNumberNotPositiveWithValue_ = (val: number) => (error: NumberNotPositive | AccountNotFound) => {
  expect(isNumberNotPositive(error)) 
  const numberNotPositiveError = error as NumberNotPositive 
  expect(numberNotPositiveError.data.value).toBe(val)
}

const assertErrorToBeNumberNotPositiveWithValue = flow(
  expectErrorTobeNumberNotPositiveWithValue_, 
  assertOverFailedAsyncResult
)

function configureMockNonExistingAccount(find: jest.Mock) {
  find.mockReturnValueOnce(TO.none)
}

function configureMockCorrectReturnValues({ account, apply, find, publish }: Deps & { account: Account }) {
  find.mockReturnValueOnce(TO.of(account));
  apply.mockReturnValueOnce(Promise.resolve());
  publish.mockReturnValueOnce(Promise.resolve());
}
