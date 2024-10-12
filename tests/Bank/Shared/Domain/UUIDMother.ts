import { UUID } from "../../../../src/Shared/Domain/UUID";

export class UUIDMother {

  static random = () => UUID.random().value

  static invalidUUID(): string {
    return this.random().replace('-', '')
  }
}