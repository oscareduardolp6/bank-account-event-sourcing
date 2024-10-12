import { validate, v4 as uuid } from 'uuid'
import { translateBrandedType } from '../TransleteBrandedType'
import { makeCreator } from '../MakeCreator'
import { InvalidUUID } from './InvalidUUID'
import { pipe } from 'fp-ts/lib/function'

export type UUID = string & { type: 'UUID' } 

const isUUID = translateBrandedType<string, UUID>(validate)

export const UUID = makeCreator<string, string, InvalidUUID, UUID>({
  typeGuard: isUUID, 
  onInvalid: InvalidUUID, 
})

const parseUnsafe = (id: string): UUID => id as UUID 

export const random = () => pipe(
  uuid(), 
  parseUnsafe
)