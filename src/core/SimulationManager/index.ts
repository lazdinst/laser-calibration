import PIDController from "../PIDController";
import Simulator from "../Simulator";
import PlotGenerator from "../PlotGenerator";

import config from "../../pid-config";

/**
 * SimulationManager class orchestrates the entire PID control loop process.
 * It initializes the PIDController with configuration settings,
 * runs the simulation, and optionally generates plots based on simulation results.
 */
export default class SimulationManager {
  context: string;
  pid: PIDController | null;
  initialOutput: number;
  noiseFactor: number;
  steps: number;
  ENABLE_PLOT: boolean;

  constructor() {
    // Initializing class properties with default values from the configuration or fallback values.
    this.context = "sim-manager";
    this.pid = null;
    this.initialOutput = config.initialOutput ?? 0;
    this.noiseFactor = config.noiseFactor ?? 0.1;
    this.steps = config.steps ?? 100;
    this.ENABLE_PLOT = config.ENABLE_PLOT ?? true;
  }

  /**
   * Initializes the PID controller with provided configuration settings.
   * @param config - Configuration object for the PID controller.
   * @returns A promise that resolves when initialization is complete.
   */
  public async init(
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
    const { kp, ki, kd, setPoint } = config;
    this.pid = new PIDController(kp, ki, kd, setPoint);

    if (!this.pid) {
      throw new Error("PID Initialization Failure.");
    }
  }

  /**
   * Runs the PID control simulation and optionally generates plots.
   * @returns A promise that resolves when the simulation and plotting are complete.
   */
  public async run(): Promise<void> {
    if (!this.pid) {
      throw new Error("PID Controller not initialized.");
    }

    const simulator = new Simulator(
      this.pid,
      this.initialOutput,
      this.noiseFactor
    );
    const results = await simulator.runSimulation(this.steps);

    if (results.length === 0) {
      throw new Error("Simulation results not found.");
    }

    if (this.ENABLE_PLOT) {
      let plotManager = new PlotGenerator(results);
      plotManager.generatePlots();
      plotManager.logPlots();
    }
  }
}
