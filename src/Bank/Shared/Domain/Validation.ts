import { getSemigroup } from "fp-ts/Array";
import { DomainError } from "./DomainError";
import * as E from 'fp-ts/Either';
import { sequenceS } from "fp-ts/lib/Apply";

const semigroupErrors = getSemigroup<DomainError>()

const applicativeValidation = E.getApplicativeValidation(semigroupErrors)

export const applyValidations = sequenceS(applicativeValidation)

