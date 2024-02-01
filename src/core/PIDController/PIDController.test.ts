import PIDController from "../PIDController";

describe("PIDController", () => {
  it("should initialize correctly", () => {
    const pid = new PIDController(1, 0.1, 0.01, 50);
    expect(pid).toBeDefined();
  });
});

it("should reset PID parameters correctly", () => {
  const pid = new PIDController(0.5, 0.5, 0.5, 1);
  pid.initializePIDValues(2, 0.2, 0.02, 60);
  expect(pid.getKp()).toEqual(2);
  expect(pid.getKi()).toEqual(0.2);
  expect(pid.getKd()).toEqual(0.02);
  expect(pid.getSetPoint()).toEqual(60);
  expect(pid.getIntegral()).toEqual(0);
  expect(pid.getDerivative()).toEqual(0);
});

it("should handle extreme values without crashing", () => {
  const pid = new PIDController(1, 1, 1, 50);
  expect(() => pid.update(1000)).not.toThrow();
});

it("should respond to a change in set point", () => {
  const pid = new PIDController(1, 0.1, 0.01, 50);
  pid.setSetPoint(60);
  expect(pid.getSetPoint()).toEqual(60);
});

it("should produce expected control output for known inputs", () => {
  const pid = new PIDController(0.5, 0.5, 0.5, 1);
  const expectedOutput = -66;
  const { output } = pid.update(45);
  expect(output).toBeCloseTo(expectedOutput);
});

it("should produce expected control output for known inputs", () => {
  const pid = new PIDController(0.5, 0.5, 0.5, 1);
  const expectedOutput = -66;
  const { output } = pid.update(45);
  expect(output).toBeCloseTo(expectedOutput);
});
