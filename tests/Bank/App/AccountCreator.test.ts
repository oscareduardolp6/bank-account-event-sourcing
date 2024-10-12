import { AccountCreator } from "../../../src/Bank/App/AccountCreator"
import { AccountSearcher } from "../../../src/Bank/App/AccountFinder"
import { Account } from "../../../src/Bank/domain/Account"
import { AccountCreated } from "../../../src/Bank/domain/AccountCreated"
import { InvalidUUID } from "../../../src/Shared/Domain/UUID"
import { EventBusMock } from "../Shared/Domain/EventBusMock"
import { UUIDMother } from "../Shared/Domain/UUIDMother"
import { MockAccountRepository } from "./__mock__/MockAccountRepository"

describe('Account', () => {
  let repository: MockAccountRepository, 
      eventBus: EventBusMock, 
      searcher: AccountSearcher, 
      creator: AccountCreator

  beforeEach(() => {
    repository = new MockAccountRepository()
    eventBus = new EventBusMock() 
    searcher = new AccountSearcher(repository) 
    creator = new AccountCreator(repository, eventBus, searcher)
  })

  it('should be created without error', async () => {
    const id = UUIDMother.random()
    const event = AccountCreated.create(id)
    await creator.create(id)
    repository.assertApplyHaveBeenCalledWith(event)
    eventBus.assertLasPublishedEventIs(event)
  })

  it('should be fail with Account with invalid UUID', async () => {
    const invalidId = UUIDMother.invalidUUID()
    await expect(creator.create(invalidId)).rejects.toThrow(InvalidUUID)
  })

  it('should not fail with an alreadoy existent account Id', async () => {
    const id = UUIDMother.random()
    const event = AccountCreated.create(id)
    const account = Account.create(id)
    await creator.create(id)
    repository.assertApplyHaveBeenCalledWith(event)
    eventBus.assertLasPublishedEventIs(event)
    repository.returnAccountOnLoad(account)
    await creator.create(id) 
    repository.assertApplyHaveBeenCalledOnce()
    eventBus.assertHaveBeenCalledOnce()
  })

})