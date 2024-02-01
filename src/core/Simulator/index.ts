import PIDController from "../PIDController";
import { promises as fsPromises } from "fs";
import config from "../../pid-config";
import * as asciichart from "asciichart";

import { OutputType, PlotType } from "./types";

const PLOT_CONFIG = {
  height: config?.PLOT_HEIGHT,
};

class Simulator {
  private pidController: PIDController;
  private systemOutput: number;
  private noiseFactor: number;
  private outputs: OutputType[] = [];
  private plots: PlotType[] = [];

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
  public async runSimulation(steps: number): Promise<void> {
    for (let step = 0; step < steps; step++) {
      // Random noise injection
      const randomNoise = this.randomNoiseMagnifier();

      // Generate Noise
      const noise = this.generateNoise(this.noiseFactor) * randomNoise;
      const noiseInjectedOuput = this.systemOutput + noise;

      // Update PID controller
      const { output, error, integral, derivative } =
        this.pidController.update(noiseInjectedOuput);

      // Update system output
      this.systemOutput += output;
      this.outputs.push({
        timestamp: new Date(),
        output: this.systemOutput,
        error: error,
        integral: integral,
        derivative: derivative,
      } as OutputType);
    }

    // Write to data file
    await this.writeToFile();

    // Generate Terminal plots
    this.generatePlots();
  }

  private randomNoiseMagnifier(): number {
    if (config?.ENABLE_NOISE_MAGNIFIER && config?.noiseMagProbability) {
      if (Math.random() > config?.noiseMagProbability) {
        const randomMagnifier = Math.floor(Math.random() * 10);
        return randomMagnifier;
      }
    }
    return 1;
  }

  private generateNoise(noiseFactor: number): number {
    return (Math.random() - 0.5) * noiseFactor;
  }

  /**
   * Sets a new set point for the PID controller.
   * @param setPoint New set point.
   */
  public setSetPoint(setPoint: number): void {
    this.pidController.setSetPoint(setPoint);
  }

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

  private generatePlots(): void {
    const outputs = this.outputs;
    if (this.outputs.length === 0) {
      throw new Error("No outputs to plot");
    }
    try {
      this.generateOutputPlot(outputs);
      this.generateErrorPlot(outputs);
      this.generateIntegralPlot(outputs);
      this.generateDerivativePlot(outputs);
      this.logGeneratedPlots();
    } catch (e) {
      console.error(e);
    }
  }

  private logGeneratedPlots(): void {
    if (this.plots.length === 0) {
      throw new Error("No plots to log");
    }
    this.plots.forEach((plot) => {
      console.log(`\n${plot.name}:\n`);
      console.log(plot.plot);
    });
  }

  private generateOutputPlot(outputs: OutputType[]): void {
    if (outputs.length === 0) {
      throw new Error("No outputs to plot");
    }
    const outputValues = outputs.map((output) => output.output);
    const plot = asciichart.plot(outputValues, PLOT_CONFIG);
    this.plots.push({
      name: "Output",
      plot,
    });
  }

  private generateErrorPlot(outputs: OutputType[]): void {
    if (outputs.length === 0) {
      throw new Error("No Errors to plot");
    }
    const errorValues = outputs.map((output) => output.error);
    const plot = asciichart.plot(errorValues, PLOT_CONFIG);
    this.plots.push({
      name: "Error",
      plot,
    });
  }

  private generateIntegralPlot(outputs: OutputType[]): void {
    if (outputs.length === 0) {
      throw new Error("No Integrals to plot");
    }
    const integralValues = outputs.map((output) => output.integral);
    const plot = asciichart.plot(integralValues, PLOT_CONFIG);
    this.plots.push({
      name: "Integral",
      plot,
    });
  }

  private generateDerivativePlot(outputs: OutputType[]): void {
    if (outputs.length === 0) {
      throw new Error("No Derivatives to plot");
    }
    const derivativeValues = outputs.map((output) => output.derivative);
    const plot = asciichart.plot(derivativeValues, PLOT_CONFIG);
    this.plots.push({
      name: "Derivative",
      plot,
    });
  }
}

export default Simulator;
