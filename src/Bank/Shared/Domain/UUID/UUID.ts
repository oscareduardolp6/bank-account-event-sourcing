import { validate } from 'uuid'
import { translateBrandedType } from '../TransleteBrandedType'
import { makeCreator } from '../MakeCreator'
import { InvalidUUID } from './InvalidUUID'

export type UUID = string & { type: 'UUID' } 

const isUUID = translateBrandedType<string, UUID>(validate)

export const UUID = makeCreator<string, string, InvalidUUID, UUID>({
  typeGuard: isUUID, 
  onInvalid: InvalidUUID, 
})