import { flow, pipe } from "fp-ts/lib/function"
import { AccountEvent } from "../../Domain/Account"
import { find } from "./Find"
import { assertAsyncOptionalIsNone, assertAsyncOptionalIsNotNone } from "../../../../../tests/Shared/Domain/jestTaskOptionFns"
import { InMemoryRepository } from "../../../Shared/Infrastructure/InMemoryRepository"
import { create } from "../Create"
import { assertAsyncResultIsCorrect } from "../../../../../tests/Shared/Domain/jestTaskEitherFns"
import { assertMockHasBeenCalledOnlyOnce, assertMockHasNotBeenCalled } from "../../../../../tests/Shared/Domain/jestFns"
import * as UUIDMother from '../../../../../tests/Shared/Domain/UUIDMother'
import * as UUID from "../../../Shared/Domain/UUID"
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'

describe('Find Account', () => {
  let testDeps; 

  beforeEach(() => {
    const repository = new InMemoryRepository()
    testDeps = { 
      find: repository.load.bind(repository), 
      apply: repository.apply.bind(repository), 
      publish: jest.fn()
    }
  })

  it('should be find an existing account', async () => {
    const accountId = UUID.random()

    const checkAccountCreationIsCorrectUsing = flow(
      create(accountId), 
      assertAsyncResultIsCorrect
    )

    const checkAccountIsFindedUsing = flow(
      find(accountId), 
      assertAsyncOptionalIsNotNone, 
    )

    await checkAccountCreationIsCorrectUsing(testDeps)
    await checkAccountIsFindedUsing(testDeps)

    assertMockHasBeenCalledOnlyOnce(testDeps.publish)
  })

  it('should return nothing if the id is invalid', async () => {
    const id = UUIDMother.invalidUUID()
    const findMock = jest.fn()

    const checkAccountToBeNoneUsing = flow(
      find(id), 
      assertAsyncOptionalIsNone
    )
    
    await checkAccountToBeNoneUsing({ ...testDeps, find: findMock})

    assertMockHasNotBeenCalled(findMock)
  })

})