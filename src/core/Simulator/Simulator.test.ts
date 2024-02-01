import PIDController from "../PIDController";
import Simulator from "../Simulator";

describe("Simulator", () => {
  it("should correctly initialize with given parameters", () => {
    const pidController = new PIDController(1, 0.1, 0.01, 50);
    const simulator = new Simulator(pidController, 10, 0.5);

    expect(simulator).toBeDefined();
  });
});

it("should run simulation and populate outputs", async () => {
  const pidController = new PIDController(1, 0.1, 0.01, 50);
  const simulator = new Simulator(pidController, 10, 0.5);
  const steps = 5;

  await simulator.runSimulation(steps);

  expect(simulator.outputs.length).toBe(steps);
});
