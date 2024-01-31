import { STATES } from "../constants/states";
export const transitionManager = {
  canTransition,
};

function canTransition(currentState: STATES, newState: STATES): boolean {
  switch (newState) {
    case STATES.Resetting:
      return (
        currentState === STATES.Complete || currentState === STATES.Stopped
      );

    case STATES.Idle:
      return currentState === STATES.Resetting;

    case STATES.Starting:
      return currentState === STATES.Idle;

    case STATES.Execute:
      return (
        currentState === STATES.Starting || currentState === STATES.Stopped
      );

    case STATES.Completing:
      return currentState === STATES.Execute;

    case STATES.Complete:
      return currentState === STATES.Completing;

    case STATES.Holding:
      return currentState === STATES.Execute;

    case STATES.Held:
      return currentState === STATES.Holding;

    case STATES.Unholding:
      return currentState === STATES.Held;

    case STATES.Suspending:
      return currentState === STATES.Execute;

    case STATES.Suspended:
      return currentState === STATES.Suspending;

    case STATES.Unsuspending:
      return currentState === STATES.Suspended;

    case STATES.Aborting:
      return currentState !== STATES.Aborted;

    case STATES.Aborted:
      return currentState === STATES.Aborting;

    case STATES.Clearing:
      return currentState === STATES.Aborted;

    case STATES.Stopping:
      return (
        currentState !== STATES.Aborting &&
        currentState !== STATES.Aborted &&
        currentState !== STATES.Clearing &&
        currentState !== STATES.Stopped
      );

    case STATES.Stopped:
      return (
        currentState === STATES.Clearing || currentState === STATES.Stopping
      );

    default:
      return false;
  }
}

export default transitionManager;
