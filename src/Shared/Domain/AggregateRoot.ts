import { DomainEvent } from "./DomainEvent";

export abstract class AggregateRoot<MyDomainEvent extends DomainEvent<unknown>> {
  protected events: MyDomainEvent[] = []

  protected record(event: MyDomainEvent) {
    this.events.push(event)
  }

  public pullDomainEvents(): MyDomainEvent[] {
    const events = [...this.events] 
    this.events = [] 
    return events
  }
}