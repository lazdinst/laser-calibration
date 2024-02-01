import PIDController from "../PIDController";
import { promises as fsPromises } from "fs";
import config from "../../pid-config";
import PlotGenerator from "./PlotGenerator";
import { OutputType } from "./types";

/**
 * Simulator class responsible for running PID control simulations.
 * It simulates the effect of a PID controller on a system output,
 * considering noise and other dynamic factors.
 */
class Simulator {
  private pidController: PIDController;
  private systemOutput: number;
  private noiseFactor: number;
  public outputs: OutputType[] = [];

  /**
   * Constructs the simulator instance.
   * @param pid The PIDController instance to be used in the simulation.
   * @param initialOutput The initial output value of the system.
   * @param noiseFactor The factor by which random noise is scaled.
   */
  constructor(
    pid: PIDController,
    initialOutput: number = 0,
    noiseFactor: number = 0
  ) {
    this.pidController = pid;
    this.systemOutput = initialOutput;
    this.noiseFactor = noiseFactor;
  }

  /**
   * Runs the PID simulation for a given number of steps.
   * It updates the system output based on the PID controller's output and records the system's behavior.
   * @param steps The number of simulation steps to run.
   */
  public async runSimulation(steps: number, plotFlag?: Boolean): Promise<void> {
    for (let step = 0; step < steps; step++) {
      // Apply random noise magnifier based on configuration
      const randomNoise = this.randomNoiseMagnifier();

      // Calculate the noise-injected system output
      const noise = this.generateNoise(this.noiseFactor) * randomNoise;
      const noiseInjectedOuput = this.systemOutput + noise;

      // Update the PID controller and retrieve its output
      const { output, error, integral, derivative } =
        this.pidController.update(noiseInjectedOuput);

      // Accumulate the PID output to the system's output
      this.systemOutput += output;
      this.outputs.push({
        timestamp: new Date(),
        output: this.systemOutput,
        error: error,
        integral: integral,
        derivative: derivative,
      } as OutputType);
    }

    // Persist simulation results to a file
    await this.writeToFile();

    // Generate and log plots for the simulation data
    if (plotFlag) {
      let plotManager = new PlotGenerator(this.outputs);
      plotManager.generatePlots();
    }
  }

  /**
   * Determines a random magnifier for noise, based on configuration settings.
   * @returns A random noise magnifier value.
   */
  private randomNoiseMagnifier(): number {
    // Validate configuration values
    if (
      typeof config?.ENABLE_NOISE_MAGNIFIER !== "boolean" ||
      typeof config?.noiseMagProbability !== "number" ||
      config.noiseMagProbability < 0 ||
      config.noiseMagProbability > 1
    ) {
      console.warn("Invalid configuration for noise magnifier.");
      return 1;
    }

    if (config.ENABLE_NOISE_MAGNIFIER) {
      if (Math.random() < config.noiseMagProbability) {
        // Adjust to get a range from 1 to 10, if that's the desired range
        const randomMagnifier = Math.floor(Math.random() * 10) + 1;
        return randomMagnifier;
      }
    }
    return 1;
  }

  /**
   * Generates a random noise value based on a given noise factor.
   * The method returns a value in the range of (-noiseFactor/2, noiseFactor/2).
   * @param noiseFactor The factor by which to scale the noise. Expected to be a non-negative number.
   * @returns A noise value to be added to the system output. Zero if the noiseFactor is non-positive.
   */
  private generateNoise(noiseFactor: number): number {
    if (typeof noiseFactor !== "number" || noiseFactor <= 0) {
      console.warn("Noise factor should be a positive number.");
      return 0;
    }

    return (Math.random() - 0.5) * noiseFactor;
  }

  /**
   * Writes the collected simulation data to a CSV file.
   */
  private async writeToFile(): Promise<void> {
    const fileName = "simulation_results.csv";
    const headers = "Timestamp,Output,Error,Integral,Derivative\n";

    const data = this.outputs
      .map((output) => {
        return `${output.timestamp.toISOString()},${output.output},${
          output.error
        },${output.integral},${output.derivative}`;
      })
      .join("\n");

    const fileContent = headers + data;

    try {
      await fsPromises.writeFile(fileName, fileContent);
      console.log(`Simulation results written to ${fileName}`);
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  }
}

export default Simulator;
