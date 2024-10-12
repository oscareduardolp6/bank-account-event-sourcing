import * as str from 'fp-ts/string'
import * as UUID from '../../../src/Bank/Shared/Domain/UUID'
import { flow, pipe } from "fp-ts/function";

export const invalidUUID = flow(
  UUID.random, 
  str.replace('-', '')
)