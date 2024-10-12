import { AccountCreator } from "../../../src/Bank/App/AccountCreator"
import { AccountSearcher } from "../../../src/Bank/App/AccountFinder"
import { Account } from "../../../src/Bank/domain/Account"
import { AccountCreated } from "../../../src/Bank/domain/AccountCreated"
import { InvalidUUID } from "../../../src/Shared/Domain/UUID"
import { EventBusMock } from "../Shared/Domain/EventBusMock"
import { MockAccountRepository } from "./__mock__/MockAccountRepository"

describe('Account', () => {

  it('should be created without error', async () => {
    const repository = new MockAccountRepository()
    const eventBus = new EventBusMock()
    const searcher = new AccountSearcher(repository)
    const creator = new AccountCreator(repository, eventBus, searcher)
    const id = '33418adf-09d9-4b24-933f-094a511448fb'
    const event = AccountCreated.create(id)
    await creator.create(id)
    repository.assertApplyHaveBeenCalledWith(event)
    eventBus.assertLasPublishedEventIs(event)
  })

  it('should be fail with Account with invalid UUID', async () => {
    const repository = new MockAccountRepository()
    const eventBus = new EventBusMock()
    const searcher = new AccountSearcher(repository)
    const creator = new AccountCreator(repository, eventBus, searcher)
    const id = '33418adf-09d9-4b24-094a511448fb'
    expect(creator.create(id)).rejects.toThrow(InvalidUUID)
  })

  it('should not fail with an alreadoy existent account Id', async () => {
    const repository = new MockAccountRepository()
    const eventBus = new EventBusMock()
    const searcher = new AccountSearcher(repository)
    const creator = new AccountCreator(repository, eventBus, searcher)
    const id = '33418adf-09d9-4b24-933f-094a511448fb'
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