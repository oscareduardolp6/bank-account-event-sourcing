import { TaskOption } from 'fp-ts/lib/TaskOption'
import { UUID } from './UUID'


export type Load<T> = (aggregateId: UUID) => TaskOption<T>