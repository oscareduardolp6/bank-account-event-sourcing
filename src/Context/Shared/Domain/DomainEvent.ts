import * as UUID from "./UUID"


export abstract class DomainEvent<Attrs> {
  public readonly abstract eventName: string
  public readonly aggregateId: string
  public readonly eventId: string
  public readonly occurredOn: Date
  public readonly attributes?: Attrs

  static fromPrimitives: FromPrimitives<Attr>

  constructor(aggregateId: string, eventId = UUID.random(), occurredOn = new Date()) {
    this.aggregateId = aggregateId
    this.occurredOn = occurredOn
    this.eventId = eventId
  }

  protected abstract attributesEquals(other?: Attrs): boolean

  equals(other: DomainEvent<Attrs>): boolean {
    if (!other) return false
    const { aggregateId, attributes, eventName } = other
    return this.aggregateId === aggregateId
      && this.eventName === eventName
      && this.attributesEquals(attributes)
  }
}

export type DomainEventPrimitives = {
  aggregateId: string
  occurredOn: Date
  attributes: unknown
  eventId: string
}

type FromPrimitives<T> = (params: DomainEventPrimitives) => DomainEvent<T>