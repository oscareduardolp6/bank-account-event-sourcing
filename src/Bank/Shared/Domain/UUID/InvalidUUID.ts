import { DomainError } from "../DomainError";

export interface InvalidUUID extends DomainError {
  name: 'InvalidUUID';
  data: { value: string; };
}
export const InvalidUUID = (value: string): InvalidUUID => ({
  name: 'InvalidUUID',
  message: `The value: <${value}> is not a valid UUID`,
  data: { value },
});
