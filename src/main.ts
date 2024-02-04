/**
 * Application Entry Point:
 * - Initializes a SimulationManager with provided configuration.
 * - Runs the simulation.
 * - Handles errors during initialization, execution, and uncaught exceptions.
 * - Responds to the SIGINT signal (Ctrl+C) to gracefully shut down the application.
 */
import config from "./pid-config";
import SimulationManager from "./core/SimulationManager";

try {
  const manager = new SimulationManager();

  manager
    .init(config)
    .then(() => manager.run())
    .catch((error) => console.error("Error: ", error));
} catch (error) {
  console.error(error);
}

process.on("uncaughtException", (error) =>
  console.error("Uncaught Exception: ", error)
);
