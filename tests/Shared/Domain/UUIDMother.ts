import { random } from "../../../src/Context/Shared/Domain/UUID";

export class UUIDMother {
  static random = random

  static invalidUUID(): string {
    return random().replace('-', '')
  }

}