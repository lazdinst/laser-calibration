import StateMachine from "./core/StateMachine";
import logger from "./logger";
import PIDController from "./core/PID";

const initParams = {
  kp: 0.5,
  ki: 0.5,
  kd: 0.5,
};

const setPoint = 0;

class MainLoop {
  context: string;
  pid: PIDController | null;

  constructor() {
    this.context = "main-loop";
    this.pid = null;
  }

  async init() {
    try {
      const { kp, ki, kd } = initParams;
      const pid = new PIDController(kp, ki, kd);
      if (!pid) {
        throw new Error("PID Initialization Failure.");
      }

      pid.setSetPoint(setPoint);

      this.pid = pid;
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  exceptionHandler(error: any) {
    logger.error({
      context: this.context,
      message: "This is an error message.",
      error: error,
    });
    console.log(error);
  }
}

const mainLoop = new MainLoop();
mainLoop.init();

process.on("uncaughtException", (error) => {
  logger.error({
    context: "main-exec",
    message: `Uncaught Exception ${error}`,
    error: error,
  });
});

process.on("SIGINT", () => {
  console.log("Application shutting down.");
  process.exit(0);
});
