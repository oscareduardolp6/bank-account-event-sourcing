import { create } from "./Create"
import { call as callTask } from '../../../Shared/Domain/TaskExt'
import { assertMockHasBeenCalledOnlyOnce, getArgumentOfCall } from "../../../../../tests/Shared/Domain/jestFns"
import { flow, pipe } from "fp-ts/lib/function"
import { isRight as isCorrect, isLeft as isIncorrect } from 'fp-ts/Either'
import * as AccountCreated from "../../Domain/AccountCreated"
import * as TO from 'fp-ts/TaskOption'
import * as T from 'fp-ts/Task'
import * as O from 'fp-ts/Option'
import * as UUID from "../../../Shared/Domain/UUID"
import * as UUIDMother from '../../../../../tests/Shared/Domain/UUIDMother'
import * as NEA from 'fp-ts/NonEmptyArray'
import { assertMockHasBeenCalledWith } from "../../../../../tests/Bank/AccountJestFns"

describe('Create Account', () => {
  let apply: jest.Mock,
      find: jest.Mock, 
      publish: jest.Mock; 
  let testDeps; 

  beforeEach(() => {
    apply = jest.fn()
    find = jest.fn()
    publish = jest.fn() 

    testDeps = {
      apply, 
      find, 
      publish
    }
  })


  it('should be created without error', async () => {
    const id = UUID.random()
    const event = AccountCreated.AccountCreated(id)
    const creation = create(id)(testDeps)

    find.mockReturnValueOnce(TO.none)
    apply.mockReturnValueOnce(Promise.resolve())
    publish.mockReturnValueOnce(Promise.resolve())
    
    await pipe(
      creation, 
      T.map(isCorrect), 
      T.map(expect), 
      callTask
    )
    
    assertMockHasBeenCalledWith(apply, event, AccountCreated.equals)
    assertMockHasBeenCalledWith(publish, event, AccountCreated.equals)

  })


  it('should be fail with Account with invalid UUID', async () => {
    const invalidUUID = UUIDMother.invalidUUID()
    const creation = create(invalidUUID)(testDeps)
    find.mockReturnValueOnce(TO.none)
    await pipe(
      creation, 
      T.map(isIncorrect), 
      T.map(expect), 
      callTask
    )
  })

  it('should produce an Account created event', async () => {
    const id = UUID.random()
    const creation = create(id)(testDeps) 

    find.mockReturnValueOnce(TO.none)
    apply.mockReturnValueOnce(Promise.resolve())
    publish.mockReturnValueOnce(Promise.resolve())
    
    await pipe(
      creation, 
      T.map(isCorrect), 
      T.map(expect), 
      callTask
    )

    const calledEvent = getArgumentOfCall(apply) as AccountCreated.AccountCreated
    expect(calledEvent.name).toBe('account.created')
  })

  it('should produce an event with the same data in attributes as the id provided', async () => {
    const id = UUID.random() 
    const creation = create(id)(testDeps)
    
    find.mockReturnValueOnce(TO.none)
    apply.mockReturnValueOnce(Promise.resolve())
    publish.mockReturnValueOnce(Promise.resolve())
    
    await pipe(
      creation, 
      T.map(isCorrect), 
      T.map(expect), 
      callTask
    )

    const calledEvent = getArgumentOfCall(apply) as AccountCreated.AccountCreated
    expect(calledEvent.data.accountId).toBe(calledEvent.aggregateId)
    expect(calledEvent.data.accountId).toBe(id)
    expect(calledEvent.aggregateId).toBe(id)

  })

  it('should not fail with an alreadoy existent account Id', async () => {
    const id = UUID.random()
    const event = AccountCreated.AccountCreated(id)
    const account = pipe(
      NEA.fromArray([event]), 
      O.getOrElseW(() => { throw new Error('Invalid Account state')})
    )
    
    const creation = create(id)(testDeps)
    const creation2 = create(id)(testDeps)

    find.mockReturnValueOnce(TO.none)
    apply.mockReturnValueOnce(Promise.resolve())
    publish.mockReturnValueOnce(Promise.resolve())

    const validateCreation = flow(T.map(isCorrect), T.map(expect), callTask)
    
    await pipe(
      creation, 
      validateCreation
    )

    assertMockHasBeenCalledWith(apply, event, AccountCreated.equals)
    assertMockHasBeenCalledWith(publish, event, AccountCreated.equals)

    find.mockReturnValue(TO.of(account)) 

    await pipe(
      creation2, 
      validateCreation
    )

    assertMockHasBeenCalledOnlyOnce(apply)
    assertMockHasBeenCalledOnlyOnce(publish)

  })

})
