import { isDefined } from "../../Shared/Domain/Defined";
import { DomainError } from "../../Shared/Domain/DomainError";

export interface AccountNotFound extends DomainError {
  name: 'AccountNotFound'
  data: { accountId: string }
}

export const AccountNotFound = (accountId: string): AccountNotFound => ({
  name: 'AccountNotFound', 
  message: `The account with the Id: <${accountId}> was not found`, 
  data: { accountId }, 
})

export const isAccountNotFound = (val: DomainError): val is AccountNotFound => 
  isDefined(val)
  && val.name === 'AccountNotFound'
  && isDefined<{}>(val.data)
  && 'accountId' in val.data 
  && typeof val.data.accountId === 'string'

