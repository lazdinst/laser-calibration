import config from "../../pid-config";
import * as asciichart from "asciichart";
import { OutputType, PlotType } from "../Simulator/types";

// Configuration for plotting, derived from the global PID configuration.
const PLOT_CONFIG = {
  height: config?.plotHeight,
};

/**
 * PlotGenerator class for generating and logging ASCII plots based on simulation outputs.
 * It supports generating different types of plots like output, error, integral, and derivative plots.
 */
class PlotGenerator {
  /**
   * Constructs a PlotGenerator instance with simulation outputs and an optional array of plots.
   * @param {OutputType[]} outputs - Array of output data from the simulation.
   * @param {PlotType[]} plots - Optional array to store generated plots.
   */
  constructor(private outputs: OutputType[], private plots: PlotType[] = []) {
    this.outputs = outputs;
    this.plots = plots;
  }

  /**
   * Public method to generate all types of plots and log them.
   * It generates output, error, integral, and derivative plots based on the simulation outputs.
   */
  public generatePlots(): void {
    if (this.outputs.length === 0) {
      throw new Error("No outputs to plot");
    }
    try {
      this.generateOutputPlot(this.outputs);
      this.generateErrorPlot(this.outputs);
      this.generateIntegralPlot(this.outputs);
      this.generateDerivativePlot(this.outputs);
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Public method to get the stored plots.
   * @returns {PlotType[]} - Array of stored plots.
   */
  public getPlots(): PlotType[] {
    return this.plots;
  }

  /**
   * Private method to log all the generated plots.
   * It logs each plot's name followed by the plot itself.
   */
  private logGeneratedPlots(): void {
    if (this.plots.length === 0) {
      throw new Error("No plots to log");
    }
    this.plots.forEach((plot) => {
      console.log(`\n${plot.name}:\n`);
      console.log(plot.plot);
    });
  }

  /**
   * Private method to generate and store the output plot.
   * @param {OutputType[]} outputs - Array of output data from the simulation.
   */
  private generateOutputPlot(outputs: OutputType[]): void {
    const outputValues = outputs.map((output) => output.output);
    const plot = asciichart.plot(outputValues, PLOT_CONFIG);
    this.plots.push({
      name: "Output",
      plot,
    });
  }

  /**
   * Private method to generate and store the error plot.
   * @param {OutputType[]} outputs - Array of output data from the simulation.
   */
  private generateErrorPlot(outputs: OutputType[]): void {
    const errorValues = outputs.map((output) => output.error);
    const plot = asciichart.plot(errorValues, PLOT_CONFIG);
    this.plots.push({
      name: "Error",
      plot,
    });
  }

  /**
   * Private method to generate and store the integral plot.
   * @param {OutputType[]} outputs - Array of output data from the simulation.
   */
  private generateIntegralPlot(outputs: OutputType[]): void {
    const integralValues = outputs.map((output) => output.integral);
    const plot = asciichart.plot(integralValues, PLOT_CONFIG);
    this.plots.push({
      name: "Integral",
      plot,
    });
  }

  /**
   * Private method to generate and store the derivative plot.
   * @param {OutputType[]} outputs - Array of output data from the simulation.
   */
  private generateDerivativePlot(outputs: OutputType[]): void {
    const derivativeValues = outputs.map((output) => output.derivative);
    const plot = asciichart.plot(derivativeValues, PLOT_CONFIG);
    this.plots.push({
      name: "Derivative",
      plot,
    });
  }

  /**
   * Public method to log the stored plots.
   * It logs each plot's name followed by the plot itself.
   */
  public logPlots(): void {
    if (this.plots.length === 0) {
      throw new Error("No plots to log");
    }
    this.plots.forEach((plot) => {
      console.log(`\n${plot.name}:\n`);
      console.log(plot.plot);
    });
  }
}

export default PlotGenerator;
