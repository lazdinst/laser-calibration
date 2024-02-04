import Simulator from "../Simulator";
import PIDController from "../PIDController";

const mockPIDController = new PIDController(1, 1, 1, 1);

describe("Simulator", () => {
  describe("runSimulation", () => {
    it("should run simulation for a given number of steps", async () => {
      const simulator = new Simulator(mockPIDController);
      const outputs = await simulator.runSimulation(5);
      expect(outputs).toHaveLength(5);
    });

    it("should update system output based on PID controller", async () => {
      const simulator = new Simulator(mockPIDController);
      const outputs = await simulator.runSimulation(5);

      expect(simulator["systemOutput"]).not.toBe(0);

      expect(outputs[0]).toHaveProperty("timestamp");
      expect(outputs[0]).toHaveProperty("output");
      expect(outputs[0]).toHaveProperty("error");
      expect(outputs[0]).toHaveProperty("integral");
      expect(outputs[0]).toHaveProperty("derivative");
    });
  });

  describe("generateRandomNoise", () => {
    it("should generate random noise within the specified range", () => {
      const simulator = new Simulator(mockPIDController);
      const noise = simulator["generateRandomNoise"](0.1);

      expect(noise).toBeGreaterThanOrEqual(-0.05);
      expect(noise).toBeLessThanOrEqual(0.05);
    });

    it("should generate zero noise for a non-positive noise factor", () => {
      const simulator = new Simulator(mockPIDController);
      const noise = simulator["generateRandomNoise"](0);
      expect(noise).toBe(0);
    });
  });
});
