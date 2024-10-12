import { DomainEvent } from "./DomainEvent";

export type Publish = <T extends DomainEvent>(event: T) => Promise<void>