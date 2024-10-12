import { isDefined } from "../Defined";
import { DomainError } from "../DomainError";

export interface NumberNotPositive extends DomainError {
  name: 'NumberNotPositive';
  data: { value: number; };
}

export const NumberNotPositive = (value: number): NumberNotPositive => ({
  name: 'NumberNotPositive',
  message: `The value: <${value}> is not a positive number`,
  data: { value }
});

export const isNumberNotPositive = (val: DomainError): val is NumberNotPositive => 
  val.name === 'NumberNotPositive'
  && isDefined<{}>(val.data) 
  && 'value' in val.data 
  && typeof val.data.value === 'number' 
