import { DomainEvent } from "../../../../src/Shared/Domain/DomainEvent";
import { EventBus } from "../../../../src/Shared/Domain/Eventbus";
import { getArgumentOfCall, getNumberOfCalls } from "../Infrastructure/jestFunctions";

export class EventBusMock implements EventBus {
  #publish = jest.fn()

  async publish<T>(event: DomainEvent<T>): Promise<void> {
    this.#publish(event)
  }

  assertLasPublishedEventIs<T>(expectedEvent: DomainEvent<T>) {
    const callEvent = getArgumentOfCall(this.#publish, 1)
    expect(expectedEvent.equals(callEvent))
  }

  assertHaveBeenCalledOnce() {
    const numberOfCalls = getNumberOfCalls(this.#publish)
    expect(numberOfCalls).toBe(1)
  }
}