import { DomainEvent } from "./DomainEvent";

export interface EventBus {
  publish<AggregateEvent extends DomainEvent<unknown>>(event: AggregateEvent): Promise<void>
}