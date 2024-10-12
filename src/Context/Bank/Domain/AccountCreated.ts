import { DomainEvent, DomainEventPrimitives } from "../../Shared/Domain/DomainEvent";
import { Primitives } from '@codelytv/primitives-type'
import * as UUID from "../../Shared/Domain/UUID";


export class AccountCreated extends DomainEvent<null> {
  public eventName: string = 'account.created'

  private constructor(accountId: string, eventId: string, ocurredOn: Date) {
    super(accountId,)
  }

  static create(accountId: string) {
    return new AccountCreated(accountId, UUID.random(), new Date())
  }

  protected attributesEquals(other: null): boolean {
    return true
  }

  fromPrimitives({ aggregateId, occurredOn, eventId }: DomainEventPrimitives) {
    return new AccountCreated(aggregateId, eventId, occurredOn)
  }

  toPrimitives(): Primitives<DomainEvent<null>> {
    return {
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn,
      eventName: this.eventName,
      eventId: this.eventId
    }
  }





}
