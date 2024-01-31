import StateMachine from "./core/StateMachine";
import logger from "./logger";

class MainLoop {
  context: string;
  stateMachine: StateMachine | null;

  constructor() {
    this.context = "main-loop";
    this.stateMachine = null;
  }

  async start() {
    try {
      const system = await this.initializeSystem();
      if (!system) {
        throw new Error("System initialization failed.");
      }
      const { stateMachine } = system;
      this.stateMachine = stateMachine;
    } catch (error) {
      this.exceptionHandler(error);
    }
  }

  async initializeSystem(): Promise<{
    stateMachine: StateMachine;
  } | null> {
    logger.info({
      context: this.context,
      message: "Main Process Initializing ...",
    });
    try {
      const stateMachine = new StateMachine();

      logger.info({
        context: this.context,
        message: "Main Process Initialized",
      });

      return { stateMachine };
    } catch (error) {
      this.exceptionHandler(error);
      return null;
    }
  }

  exceptionHandler(error: any) {
    logger.error({
      context: this.context,
      message: "This is an error message.",
      error: error,
    });
  }
}

const mainLoop = new MainLoop();
mainLoop.start();

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
