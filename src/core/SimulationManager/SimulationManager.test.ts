import SimulationManager from "../SimulationManager";
import PIDController from "../PIDController";
import Simulator from "../Simulator";
import PlotGenerator from "../PlotGenerator";

jest.mock("../PIDController");
jest.mock("../Simulator");
jest.mock("../PlotGenerator");

describe("SimulationManager", () => {
  let simManager: SimulationManager;

  beforeEach(() => {
    jest.clearAllMocks();
    simManager = new SimulationManager();
  });

  test("should initialize correctly with default config", async () => {
    await expect(
      simManager.init({ kp: 0.1, ki: 0.01, kd: 0.1, setPoint: 1 })
    ).resolves.toBeUndefined();
    expect(simManager.pid).toBeInstanceOf(PIDController);
  });

  test("should successfully run the simulation", async () => {
    await simManager.init({ kp: 0.1, ki: 0.01, kd: 0.1, setPoint: 1 });
    Simulator.prototype.runSimulation = jest.fn().mockResolvedValue([
      {
        timestamp: new Date("2024-02-01T00:00:00"),
        output: 1.0,
        error: 0.1,
        integral: 0.01,
        derivative: 0.001,
      },
    ]);

    await expect(simManager.run()).resolves.toBeUndefined();
    expect(Simulator.prototype.runSimulation).toHaveBeenCalled();
    if (simManager.ENABLE_PLOT) {
      expect(PlotGenerator).toHaveBeenCalled();
    }
  });

  test("should throw an error if run is called without initializing PID controller", async () => {
    await expect(simManager.run()).rejects.toThrow(
      "PID Controller not initialized."
    );
  });
});
