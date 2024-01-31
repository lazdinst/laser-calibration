import { CommandAction } from "./constants/commands";
import { STATES } from "./constants/states";
import logger from "../../logger";

import transitionManager from "./utils/transitionManager";
import ModuleExecutor, { ModuleName } from "../ModuleExecutor";

/**
 * StateMachine - A state machine class for managing system states
 * following the PackML standard.
 *
 * @class StateMachine
 */
class StateMachine {
  private context: string = "state-machine";
  private currentState: STATES;
  private moduleExecutor: ModuleExecutor | null;
  private module: ModuleName = "dispense";

  constructor() {
    this.currentState = STATES.Idle;
    this.moduleExecutor = null;
    logger.info({
      context: this.context,
      message: `State Machine Initialized: ${STATES[this.currentState]}:${
        this.currentState
      }`,
    });
  }

  public systemStart = () => {
    logger.info({
      context: this.context,
      message: "System Start Initiated ...",
    });
    this.start();
  };

  public systemStop = () => {
    logger.info({
      context: this.context,
      message: "System Stop Initiated ...",
    });
    this.stop();
  };

  public systemReset = () => {
    logger.info({
      context: this.context,
      message: "System Reset Initiated ...",
    });
    this.reset();
  };

  public systemHold = (): Promise<void> => {
    logger.info({
      context: this.context,
      message: "System Hold Initiated ...",
    });
    return this.hold();
  };

  public setState = (stateContext: string | null, newState: STATES) => {
    logger.warn({
      context: this.context,
      message: `[${stateContext}] State Transistion: ${
        STATES[this.currentState]
      }:${this.currentState} => ${STATES[newState]}:${newState}`,
    });

    this.currentState = newState;
  };

  /**
   * Starts the system. Transitions from Stopped to Starting and then to Running.
   */
  private start() {
    if (transitionManager.canTransition(this.currentState, STATES.Starting)) {
      this.setState("start", STATES.Starting);
      logger.info({
        context: this.context,
        message: "System Start Successful",
      });

      this.moduleExecutor = new ModuleExecutor(
        this.setState,
        this.getCurrentState,
        this.module
      );

      this.moduleExecutor
        .execute()
        .then(() => {
          logger.info({
            context: this.context,
            message: "Module Execution Completing",
          });
          this.complete();
        })
        .catch((error) => {
          logger.error({
            context: this.context,
            message: `Module Execution Error: ${error}`,
          });
          throw new Error(error);
        });
    } else {
      let msg = `Start Transistion Failure. ${this.currentState} => ${STATES.Starting}`;
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
  }

  /**
   * Stops the system. Transitions from Stopped to Starting and then to Running.
   */
  private stop() {
    if (!this.moduleExecutor) {
      let msg = "No module executor found. System cannot stop.";
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
    if (transitionManager.canTransition(this.currentState, STATES.Stopping)) {
      this.setState("stop", STATES.Stopping);
      this.moduleExecutor?.stop();
      logger.info({
        context: this.context,
        message: "System Stop Successful",
      });
      return;
    } else {
      let msg = `[Stop Transistion Failure: ${STATES[this.currentState]}:${
        this.currentState
      } => ${STATES[STATES.Stopping]}:${STATES.Stopping}]`;
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
  }

  /**
   * Execute the Abort command action to initiate the abort transition.
   */
  private abort() {}

  /**
   * Execute the Clear command action to initiate the clear transition.
   */
  private async clear(): Promise<void> {
    let targetState = STATES.Clearing;
    let sc = "clear";
    if (transitionManager.canTransition(this.currentState, targetState)) {
      this.setState(sc, targetState);
      logger.info({
        context: this.context,
        message: "System Clear Successful",
      });
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setState(sc, STATES.Stopped);
          resolve;
        }, 3000)
      );
    } else {
      let msg = `Clear Transistion Failure. ${this.currentState} => ${targetState}`;
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
  }

  /**
   * Execute the Reset command action to initiate the reset transition.
   */
  private async reset(): Promise<void> {
    if (transitionManager.canTransition(this.currentState, STATES.Resetting)) {
      this.setState("reset", STATES.Resetting);
      logger.info({
        context: this.context,
        message: "System Reset Successful",
      });
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setState("reset", STATES.Idle);
          resolve;
        }, 3000)
      );
    } else {
      let msg = `Reset Transistion Failure. ${this.currentState} => ${STATES.Resetting}`;
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
  }

  /**
   * Execute the Suspend command action to initiate the suspend transition.
   */
  private async suspend(): Promise<void> {
    if (transitionManager.canTransition(this.currentState, STATES.Suspending)) {
      this.setState("suspend", STATES.Suspending);
      logger.info({
        context: this.context,
        message: "System Suspended.",
      });
      await new Promise((resolve) =>
        setTimeout(() => {
          this.setState("suspend", STATES.Suspended);
          resolve;
        }, 3000)
      );
    } else {
      let msg = `Suspend Transistion Failure. ${this.currentState} => ${STATES.Suspending}`;
      logger.error({
        context: this.context,
        message: msg,
      });
      throw new Error(msg);
    }
  }

  /**
   * Execute the Unsuspend command action to initiate the unsuspend transition.
   */
  private unsuspend() {
    // Implement unsuspend transition logic
  }

  /**
   * Execute the Hold command action to initiate the hold transition.
   */
  private hold(): Promise<void> {
    return new Promise((resolve, reject) => {
      let sc = "hold";
      let targetState = STATES.Holding;

      if (transitionManager.canTransition(this.currentState, targetState)) {
        this.setState(sc, targetState);
        logger.info({
          context: this.context,
          message: "System Holding Successful",
        });
        resolve();
      } else {
        let msg = `[Hold Transistion Failure: ${STATES[this.currentState]}:${
          this.currentState
        } => ${STATES[targetState]}:${targetState}]`;
        logger.error({
          context: this.context,
          message: msg,
        });
        reject(new Error(msg));
      }
    });
  }

  /**
   * Execute the Unhold command action to initiate the unhold transition.
   */
  private unhold() {
    // Implement unhold transition logic
  }

  /**
   * Execute the Complete command action to initiate the complete transition.
   */
  private complete() {
    let sc = "complete";
    let targetState = STATES.Complete;

    if (transitionManager.canTransition(this.currentState, targetState)) {
      this.setState(sc, targetState);
      logger.info({
        context: this.context,
        message: "System Complete Successful",
      });
    } else {
      logger.error({
        context: this.context,
        message: `System Reset Failure. ${this.currentState} => ${targetState}`,
      });
    }
  }

  /**
   * Get the current state of the system.
   *
   * @returns The current state.
   */
  public getCurrentState(): STATES {
    return this.currentState;
  }

  public executeCommand(command: CommandAction): void {}
}

export default StateMachine;
