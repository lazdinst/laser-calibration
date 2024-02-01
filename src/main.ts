import PIDController from "./core/PIDController";
import Simulator from "./core/Simulator";
import config from "./pid-config";

class MainLoop {
  context: string;
  pid: PIDController | null;

  constructor() {
    this.context = "main-loop";
    this.pid = null;
  }

  public init(
    config: {
      kp: number;
      ki: number;
      kd: number;
      setPoint: number;
    } = {
      kp: 0.05,
      ki: 0.5,
      kd: 0.1,
      setPoint: 1,
    }
  ): Promise<void> {
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
    const noiseFactor = config?.noiseFactor || 0;
    const initialOutput = config?.initialOutput || 0;
    const simulator = new Simulator(this.pid, initialOutput, noiseFactor);
    try {
      simulator.runSimulation(config.steps);
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  exceptionHandler(error: any) {
    throw error;
  }
}

const delayDuration = 1000;

setTimeout(() => {
  try {
    const mainLoop = new MainLoop();
    mainLoop.init(config);
    mainLoop.run();
  } catch (error) {
    throw error;
  }
}, delayDuration);

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception: ", error);
});

process.on("SIGINT", () => {
  console.log("Application shutting down.");
  process.exit(0);
});
