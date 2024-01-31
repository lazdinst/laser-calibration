import PIDController from "../PIDController";

describe("PIDController", () => {
  it("should initialize correctly", () => {
    const pid = new PIDController(1, 0.1, 0.01, 50);
    expect(pid).toBeDefined();
  });
});

it("should respond to a change in set point", () => {
  const pid = new PIDController(1, 0.1, 0.01, 50);
  pid.setSetPoint(60);
  expect(pid.getSetPoint()).toEqual(60);
});
