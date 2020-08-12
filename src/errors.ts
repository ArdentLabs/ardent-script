export class ValueNotFound extends Error {
  public readonly name: string
  public readonly availableValues: string[]

  constructor(name: string, availableValues: string[]) {
    super(`Variable "${name}" is not a valid variable`)
    this.name = name
    this.availableValues = availableValues

    // Workaround for down-level compilation
    // https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#extending-built-ins-like-error-array-and-map-may-no-longer-work
    Object.setPrototypeOf(this, ValueNotFound.prototype)
  }
}

export class DuplicateVariableName extends Error {
  public readonly name: string

  constructor(name: string) {
    super(`Duplicate variable "${name}"`)
    this.name = name

    Object.setPrototypeOf(this, DuplicateVariableName.prototype)
  }
}

export class FailedVariableInstantiation extends Error {
  public readonly name: string
  public readonly reason: unknown

  constructor(name: string, reason: unknown) {
    super(
      `Failed to instantiate variable "${name}": ${
        reason instanceof Error ? reason.message : reason
      }`
    )
    this.name = name
    this.reason = reason

    Object.setPrototypeOf(this, FailedVariableInstantiation.prototype)
  }
}
