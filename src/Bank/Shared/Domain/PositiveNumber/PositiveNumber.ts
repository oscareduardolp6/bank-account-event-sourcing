import { isDefined } from "../Defined"
import { makeCreator } from "../MakeCreator"
import { NumberNotPositive } from "./NumberNotPositive"

export type PositiveNumber = number & { type: 'PositiveNumber' }

export const isPositiveNumber = (num: number): num is PositiveNumber => 
  isDefined(num) 
  && num >= 0

export const PositiveNumber = makeCreator<number, number, NumberNotPositive, PositiveNumber>({
  typeGuard: isPositiveNumber, 
  onInvalid: NumberNotPositive
})