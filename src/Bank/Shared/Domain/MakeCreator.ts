import { pipe } from "fp-ts/function"
import * as Option from 'fp-ts/Option'
import * as Either from 'fp-ts/Either'

type Parameters<Input, SanitizedOutput extends Input, ErrorType> = {
  sanitizer?: (val: Input) => SanitizedOutput,
  typeGuard: (val: SanitizedOutput) => boolean,
  onInvalid: (val: SanitizedOutput) => ErrorType
}

export const makeCreator = <Input, SanitizedOutput extends Input, ErrorType, ResultType>({ 
  typeGuard, 
  sanitizer, 
  onInvalid
}: Parameters<Input, SanitizedOutput, ErrorType>) => (val: Input) => pipe(
  Option.fromNullable(sanitizer),
  Option.map(sanitizer => sanitizer(val)),
  Option.getOrElse(() => val as SanitizedOutput), 
  Either.fromPredicate(typeGuard, onInvalid) , 
  val => val as Either.Either<ErrorType, ResultType>, 
)