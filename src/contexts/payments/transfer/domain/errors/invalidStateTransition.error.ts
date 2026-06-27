import { DomainError } from "#shared/domain/errors";

export class InvalidStateTransitionError extends DomainError {
  constructor(
    public readonly currentState: string,
    public readonly targetState: string
  ) {
    super(
      `Invalid state transition from ${currentState} to ${targetState}`,
      "INVALID_STATE_TRANSITION"
    );
  }
}
