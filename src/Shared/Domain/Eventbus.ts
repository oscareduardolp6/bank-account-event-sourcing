import { DomainEvent } from "./DomainEvent";

export interface EventBus {
  publish<T>(event: DomainEvent<T>): Promise<void>
}