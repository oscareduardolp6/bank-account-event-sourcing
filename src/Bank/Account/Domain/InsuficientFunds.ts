import { isDefined } from "../../Shared/Domain/Defined";
import { DomainError } from "../../Shared/Domain/DomainError";

export interface InsuficientFunds extends DomainError {
  name: 'InsuficientFunds'
  data: {
    ammount: number
    balance: number 
  }
}

export const InsuficientFunds = ({ ammount, balance }: InsuficientFunds['data']): InsuficientFunds => ({
  name: 'InsuficientFunds', 
  message: `The account doesn't have enought funds for the operation`, 
  data: { ammount, balance }
})

export const isInsuficientFunds = (val: DomainError): val is InsuficientFunds => 
  isDefined(val)
  && val.name === 'InsuficientFunds' 
  && isDefined<{}>(val.data)
  && 'ammount' in val.data
  && typeof val.data.ammount === 'number'