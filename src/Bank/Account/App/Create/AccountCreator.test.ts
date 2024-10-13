import { create } from "./Create"
import { flow } from "fp-ts/lib/function"
import * as AccountCreated from "../../Domain/AccountCreated"
import * as UUID from "../../../Shared/Domain/UUID"
import * as UUIDMother from '../../../../../tests/Shared/Domain/UUIDMother'
import { InMemoryRepository } from "../../../Shared/Infrastructure/InMemoryRepository"
import { find } from "../Find"
import { assertAsyncResultIsCorrect, assertAsyncResultIsIncorrect, assertOverFailedAsyncResult } from "../../../../../tests/Shared/Domain/jestTaskEitherFns"
import { assertAsyncOptionalIsNone, assertAsyncOptionalIsNotNone } from "../../../../../tests/Shared/Domain/jestTaskOptionFns"
import { assertMockHasBeenCalledOnlyOnce, getArgumentOfCall } from "../../../../../tests/Shared/Domain/jestFns"

describe('Create Account', () => {
  let publish: jest.Mock; 
  let testDeps; 

  beforeEach(() => {
    const repository = new InMemoryRepository()
    publish = jest.fn() 

    testDeps = {
      apply: repository.apply.bind(repository), 
      find: repository.load.bind(repository), 
      publish
    }
  })


  it('should be created without error', async () => {
    const accountId = UUID.random()

    const checkResultIsCorrectUsing = flow(
      create(accountId), 
      assertAsyncResultIsCorrect
    )

    const checkAccountExistsUsing = flow(
      find(accountId), 
      assertAsyncOptionalIsNotNone
    )

    await checkResultIsCorrectUsing(testDeps)
    await checkAccountExistsUsing(testDeps)
  })


  it('should be fail with Account with invalid UUID', async () => {
    const invalidUUID = UUIDMother.invalidUUID()

    const checkCreationFailUsing = flow(
      create(invalidUUID), 
      assertAsyncResultIsIncorrect
    )

    const checkCreationFailWithInvalidUuidErrorUsing = flow(
      create(invalidUUID), 
      assertOverFailedAsyncResult(invalidUuidError => {
        expect(invalidUuidError.name).toBe('InvalidUUID')
        expect(invalidUuidError.data.value).toBe(invalidUUID) 
      })
    )

    await checkCreationFailUsing(testDeps)
    await checkCreationFailWithInvalidUuidErrorUsing(testDeps) 
  })

  it('should produce an event with the same data in attributes as the id provided', async () => {
    const accountId = UUID.random()

    const checkCreationOkUsing = flow(
      create(accountId), 
      assertAsyncResultIsCorrect, 
    )

    await checkCreationOkUsing(testDeps)

    const publishedEvent = getArgumentOfCall(publish) as AccountCreated.AccountCreated 
    expect(publishedEvent.data.accountId).toBe(accountId)
    expect(publishedEvent.aggregateId).toBe(accountId)

  })

  it('should not fail with an alreadoy existent account Id', async () => {
    const accountId = UUID.random() 

    const checkCreation1CorrectUsing = flow(
      create(accountId), 
      assertAsyncResultIsCorrect
    )

    const checkCreation2CorrectUsing = flow(
      create(accountId), 
      assertAsyncResultIsCorrect
    )

    await checkCreation1CorrectUsing(testDeps) 
    await checkCreation2CorrectUsing(testDeps)

    assertMockHasBeenCalledOnlyOnce(publish)

  })

})
