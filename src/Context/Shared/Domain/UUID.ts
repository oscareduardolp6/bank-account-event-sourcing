import { validate, v4 as uuid } from 'uuid'
import * as  E from 'fp-ts/Either'


export type UUID = string & { type: 'UUID' }

type InvalidUUID = {
  type: 'InvalidUUID', 
  message: string 
  data: { value: string }
}

const isUUID = (id: string): id is UUID => validate(id)

const InvalidUUID = (value: string): InvalidUUID => ({
  data: { value }, 
  message: `The value: <${value}> is not a valid UUID`, 
  type: 'InvalidUUID'
})

export const UUID = E.fromPredicate(isUUID, InvalidUUID)

export const random = uuid
