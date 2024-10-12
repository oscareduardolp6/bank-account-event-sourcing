import { DomainEvent } from "../../../src/Context/Shared/Domain/DomainEvent";
import { EventBus } from "../../../src/Context/Shared/Domain/EventBus";
import { getArgumentOfCall, getNumberOfCalls } from "../../Shared/Domain/jestFns";

export class MockEventBus implements EventBus {
  private publishMock: jest.Mock

  constructor() {
    this.publishMock = jest.fn()
  }

  async publish<AggregateEvent extends DomainEvent<unknown>>(event: AggregateEvent): Promise<void> {
    this.publishMock(event)
  }

  assertPublishHasBeenCalledWith<AggregateEvent extends DomainEvent<unknown>>(expectedEvent: AggregateEvent) {
    const calledEvent = getArgumentOfCall(this.publishMock) 
    expect(expectedEvent.equals(calledEvent))
  }

  assertPublishHasBeenCalledOnlyOnce() {
    expect(getNumberOfCalls(this.publishMock)).toBe(1)
  }

}