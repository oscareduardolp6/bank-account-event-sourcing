import { UUID } from "../../Shared/Domain/UUID";
import * as O from 'fp-ts/Option'

export type Repository<Aggregate, AggregateEvents> = {
  load(id: UUID): Promise<O.Option<Aggregate>>
  apply(event: AggregateEvents): Promise<void>;
};
