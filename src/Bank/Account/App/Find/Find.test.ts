import { pipe } from "fp-ts/lib/function"
import { AccountEvent } from "../../Domain/Account"
import { find } from "./Find"
import { call as callTask } from "../../../Shared/Domain/TaskExt"
import * as UUIDMother from '../../../../../tests/Shared/Domain/UUIDMother'
import * as UUID from "../../../Shared/Domain/UUID"
import * as AccountCreated from "../../Domain/AccountCreated"
import * as T from 'fp-ts/Task'
import * as TO from 'fp-ts/TaskOption'
import * as O from 'fp-ts/Option'
import * as NEA from 'fp-ts/NonEmptyArray'

describe('Find Account', () => {
  let findInDb: jest.Mock

  beforeEach(() => {
    findInDb = jest.fn()
  })

  it('should be find an existing account', async () => {
    const id = UUID.random() 
    const search = find(id)({ find: findInDb })
    const event = AccountCreated.AccountCreated(id) 
    const account = createAccountFromEvent(event) 
    findInDb.mockReturnValueOnce(TO.of(account))

    await pipe(
      search, 
      T.map(O.isSome),
      T.map(expect), 
      callTask
    )

  })

  it('should return nothing if the id is invalid', async () => {
    const id = UUIDMother.invalidUUID()
    const search = find(id)({ find: findInDb })
    await pipe(
      search, 
      T.map(O.isNone), 
      T.map(expect), 
      callTask
    )
  })

})

const createAccountFromEvent = (event: AccountEvent) => pipe(
  NEA.fromArray([event]), 
  O.getOrElseW(() => { throw new Error('Invalid Account state') })
)