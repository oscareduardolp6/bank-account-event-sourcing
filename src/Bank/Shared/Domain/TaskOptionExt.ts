import * as TO from 'fp-ts/TaskOption'
import * as O from 'fp-ts/Option'

export const isSome = TO.map(O.isSome)