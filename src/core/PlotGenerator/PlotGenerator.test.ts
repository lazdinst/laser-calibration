import PlotGenerator from "../PlotGenerator";
import { OutputType } from "../Simulator/types";

const mockOutputs: OutputType[] = [
  {
    timestamp: new Date(),
    output: 1,
    error: 0.1,
    integral: 0.01,
    derivative: 0.001,
  },
];

describe("PlotGenerator", () => {
  let plotGenerator: PlotGenerator;

  beforeEach(() => {
    plotGenerator = new PlotGenerator(mockOutputs);
  });

  it("should be instantiated with provided outputs", () => {
    expect(plotGenerator).toBeDefined();
  });

  it("should generate plots based on the provided outputs", () => {
    plotGenerator.generatePlots();
    let plots = plotGenerator.getPlots();
    expect(plots.length).toBeGreaterThan(0);
  });
});
