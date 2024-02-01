import PIDController from "../PIDController";
import fs from "fs";
import config from "../../../pid-config";

class Simulator {
  private pidController: PIDController;
  private systemOutput: number;
  private noiseFactor: number;
  private outputs: {
    timestamp: Date;
    output: number;
    error: number;
    integral: number;
    derivative: number;
  }[] = [];

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
   * Runs the simulation for a specified number of steps.
   * @param steps Number of steps to run the simulation.
   */
  public runSimulation(steps: number): void {
    for (let step = 0; step < steps; step++) {
      if (config.SET_POINT_FLAG) {
        if (Math.random() > 0.995) {
          console.log("Randomly setting new set point");
          this.generateSetPoint();
        }
      }

      if (config.NOISE_FLAG) {
        if (Math.random() > 0.995) {
          console.log("Randomly setting new noise Factor");
          this.generateSetPoint();
        }
      }
      const noise = this.generateNoise(this.noiseFactor);
      const { output, error, integral, derivative } = this.pidController.update(
        this.systemOutput + noise
      );

      this.systemOutput += output;
      this.outputs.push({
        timestamp: new Date(),
        output: this.systemOutput,
        error: error,
        integral: integral,
        derivative: derivative,
      });
    }
    this.writeToFile();
  }

  private generateNoise(noiseFactor: number): number {
    return (Math.random() - 0.5) * noiseFactor;
  }

  private generateSetPoint(): number {
    return Math.random() * 100;
  }

  /**
   * Sets a new set point for the PID controller.
   * @param setPoint New set point.
   */
  public setSetPoint(setPoint: number): void {
    this.pidController.setSetPoint(setPoint);
  }

  private writeToFile(): void {
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

    fs.writeFile(fileName, fileContent, (err) => {
      if (err) {
        console.error("Error writing to file:", err);
      } else {
        console.log(`Simulation results written to ${fileName}`);
      }
    });
  }
}

export default Simulator;
