import { DomainEvent } from "./DomainEvent";

export type Apply = <T extends DomainEvent>(event: T) => Promise<void>