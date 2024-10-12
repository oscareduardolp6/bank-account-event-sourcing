import { DomainError } from "../DomainError"

export interface NumberNotAnInteger extends DomainError {
  name: 'NumberNotAnInteger'
  data: { value: number }
}

export const NumberNotAnInteger = (value: number): NumberNotAnInteger => ({
  name: 'NumberNotAnInteger', 
  message: `The value: <${value}> is not an integer`, 
  data: { value }
})