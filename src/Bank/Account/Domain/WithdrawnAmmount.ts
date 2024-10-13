import { DomainEvent } from "../../Shared/Domain/DomainEvent";

export interface WithdrawnAmmount extends DomainEvent {
  name: 'account.withdrawn'
  data: {
    accountId: string
    ammount: number
  }
}

export const WithdrawnAmmount = (payload: WithdrawnAmmount['data']): WithdrawnAmmount => ({
  aggregateId: payload.accountId, 
  data: payload, 
  name: 'account.withdrawn', 
  occurredOn: new Date()
})