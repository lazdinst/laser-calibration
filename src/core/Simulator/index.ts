import PIDController from "../PIDController";
import { promises as fsPromises } from "fs";
import config from "../../pid-config";
import { OutputType } from "./types";

/**
 * Simulator Class is designed to execute simulations of PID (Proportional-Integral-Derivative) control.
 * It models the influence of a PID controller on the output of a system,
 * taking into account various dynamic elements and noise factors.
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
   * @returns A promise that resolves to an array of OutputType objects.
   */
  public async runSimulation(steps: number): Promise<OutputType[]> {
    try {
      for (let step = 0; step < steps; step++) {
        // Calculate the noise-injected system output
        const noise = this.generateRandomNoise(this.noiseFactor);
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

      // Write simulation results to a file
      await this.writeToFile();
    } catch (error) {
      throw error;
    }

    return this.outputs;
  }

  /**
   * Generates a random noise value based on a given noise factor.
   * The method returns a value in the range of (-noiseFactor/2, noiseFactor/2).
   * @param noiseFactor The factor by which to scale the noise. Expected to be a non-negative number.
   * @returns A noise value to be added to the system output. Zero if the noiseFactor is non-positive.
   */
  private generateRandomNoise(noiseFactor: number): number {
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
