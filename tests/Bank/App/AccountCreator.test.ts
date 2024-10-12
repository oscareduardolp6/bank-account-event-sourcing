import { pipe } from "fp-ts/lib/function"
import { AccountCreator } from "../../../src/Context/Bank/App/AccountCreator"
import { AccountSearcher } from "../../../src/Context/Bank/App/AccountSearcher"
import { AccountCreated } from "../../../src/Context/Bank/Domain/AccountCreated"
import { UUIDMother } from "../../Shared/Domain/UUIDMother"
import { MockAccountRepository } from "./MockAccountRepository"
import { MockEventBus } from "./MockEventBus"
import { isLeft as isInvalid, isRight as isValid, mapLeft, map } from "fp-ts/Either"
import { Account } from "../../../src/Context/Bank/Domain/Account"

describe('Account Creator', () => {
  let repository: MockAccountRepository, 
      eventBus: MockEventBus, 
      searcher: AccountSearcher, 
      creator: AccountCreator

  beforeEach(() => {
    repository = new MockAccountRepository()
    eventBus = new MockEventBus() 
    searcher = new AccountSearcher(repository)
    creator = new AccountCreator(repository, eventBus, searcher)
  })
  

  it('should be created without error', async () => {
    const id = UUIDMother.random()
    const event = AccountCreated.create(id)
    const creation = await creator.create(id)
    expect(isValid(creation))
    repository.assertApplyHasBeenCalledWith(event) 
    eventBus.assertPublishHasBeenCalledWith(event)
  })

  it('should be fail with Account with invalid UUID', async () => {
    const id = UUIDMother.invalidUUID()
    const creation = await creator.create(id)
    expect(isInvalid(creation))
    pipe(
      creation, 
      mapLeft(error => {
        expect(error.type).toBe('InvalidUUID')
        expect(error.data.value).toBe(id)
      })
    )
  })

  it('should not fail with an alreadoy existent account Id', async () => {
    const id = UUIDMother.random() 
    const creation1 = await creator.create(id) 
    const event = AccountCreated.create(id)
    pipe(
      Account.create(id), 
      map(repository.returnOnLoad.bind(repository))
    )
    eventBus.assertPublishHasBeenCalledWith(event)
    repository.assertApplyHasBeenCalledWith(event)
    const creation2 = await creator.create(id)
    expect(isValid(creation1))
    expect(isValid(creation2))
    repository.assertApplyHasBeenCalledOnlyOnce()
    eventBus.assertPublishHasBeenCalledOnlyOnce()
  })

})