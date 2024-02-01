import config from "../../pid-config";
import * as asciichart from "asciichart";
import { OutputType, PlotType } from "./types";

const PLOT_CONFIG = {
  height: config?.PLOT_HEIGHT,
};

class PlotGenerator {
  constructor(private outputs: OutputType[], private plots: PlotType[] = []) {
    this.outputs = outputs;
    this.plots = plots;
  }
  public generatePlots(): void {
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
