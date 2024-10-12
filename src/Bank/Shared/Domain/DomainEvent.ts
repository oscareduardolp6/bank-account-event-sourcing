export type DomainEvent = {
  name: string 
  aggregateId: string
  occurredOn: Date
  data?: unknown
}