import { validate, v4 as uuid } from 'uuid'

export class UUID {
  readonly value: string 

  constructor(id: string) {
    this.ensureIsValidUUID(id)
    this.value = id
  }

  private ensureIsValidUUID(id: string) {
    if(!validate(id)) throw new InvalidUUID(id)
  }

  static random(): UUID {
    return new UUID(uuid())
  }
}

export class InvalidUUID extends Error {
  constructor(private readonly value: string) {
    super(`The value: <${value}> is not a valid UUID`)
  }
}