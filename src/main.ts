import logger from "./logger";
import PIDController from "./core/PIDController";
import Simulator from "./core/Simulator";
import config from "../pid-config";

class MainLoop {
  context: string;
  pid: PIDController | null;

  constructor() {
    this.context = "main-loop";
    this.pid = null;
  }

  public init(config: {
    kp: number;
    ki: number;
    kd: number;
    setPoint: number;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        const { kp, ki, kd, setPoint } = config;
        const pid = new PIDController(kp, ki, kd, setPoint);
        if (!pid) {
          throw new Error("PID Initialization Failure.");
        }

        this.pid = pid;
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  public run(): void {
    if (!this.pid) {
      throw new Error("PID Controller not initialized.");
    }
    const noiseFactor = 0.1;
    const initialOutput = 0;
    const simulator = new Simulator(this.pid, initialOutput, noiseFactor);

    try {
      simulator.runSimulation(config.steps);
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

try {
  const mainLoop = new MainLoop();
  mainLoop.init(config);
  mainLoop.run();
} catch (error) {
  logger.error({
    context: "main-exec",
    message: `Error: ${error}`,
    error: error,
  });
  throw error;
}

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
