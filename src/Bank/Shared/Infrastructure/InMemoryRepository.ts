import { pipe } from 'fp-ts/lib/function'
import { DomainEvent } from '../Domain/DomainEvent'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as T from 'fp-ts/Task'
import { UUID } from '../Domain/UUID'

export class InMemoryRepository {
  private events: DomainEvent[] 

  constructor(){
    this.events = []
  }

  async apply<T extends DomainEvent>(event: T) {
    this.events.push(event)
  }

  load<AggregateEvent extends DomainEvent>(aggregateId: UUID) {
    const foundedEvents = this.events
      .filter(event => event.aggregateId === aggregateId) as AggregateEvent[] 
    return pipe(
      foundedEvents, 
      NEA.fromArray, 
      T.of
    )
  }


}