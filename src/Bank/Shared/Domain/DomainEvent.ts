import { Eq, struct } from "fp-ts/lib/Eq"
import { eqDate } from 'fp-ts/Date'
import { Eq as stringEq } from 'fp-ts/string'

export type DomainEvent = {
  name: string 
  aggregateId: string
  occurredOn: Date
  data?: unknown
}

export const createEq = (attributesEq: Eq<unknown>) => struct<DomainEvent>({
  aggregateId: stringEq, 
  name: stringEq, 
  occurredOn: eqDate, 
  data: attributesEq
})