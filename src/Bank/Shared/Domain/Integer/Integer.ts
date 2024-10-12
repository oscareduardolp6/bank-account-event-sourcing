import { isDefined } from "../Defined"
import { makeCreator } from "../MakeCreator"
import { NumberNotAnInteger } from "./NumberNotAnInteger"

export type Integer = number & { type: 'Integer' }

const isInteger = (num: number): num is Integer => 
  isDefined(num)
  && !num.toString().includes('.')

export const Integer = makeCreator<number, number, NumberNotAnInteger, Integer>({
  typeGuard: isInteger, 
  onInvalid: NumberNotAnInteger, 
})
