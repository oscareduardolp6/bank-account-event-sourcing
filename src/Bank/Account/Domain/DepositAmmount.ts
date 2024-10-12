import { makeCreator } from "../../Shared/Domain/MakeCreator"
import { isPositiveNumber } from "../../Shared/Domain/PositiveNumber"
import { NumberNotPositive } from "../../Shared/Domain/PositiveNumber/NumberNotPositive"

export type DepositAmmount = number & { type: 'DepositAmmount' }

export const DepositAmmount = makeCreator<number, number, NumberNotPositive, DepositAmmount>({
  onInvalid: NumberNotPositive, 
  typeGuard: isPositiveNumber
})