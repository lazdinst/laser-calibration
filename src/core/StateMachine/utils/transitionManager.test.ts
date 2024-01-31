import { STATES } from "../constants/states";
import transitionManager from "./transitionManager";
const { canTransition } = transitionManager;

describe("canTransition function", () => {
  it("should allow transition from Stopped to Starting", () => {
    expect(canTransition(STATES.Stopped, STATES.Starting)).toBe(false);
  });

  it("should allow transition from Stopped to Clearing", () => {
    expect(canTransition(STATES.Stopped, STATES.Clearing)).toBe(true);
  });

  it("should allow transition from Clearing to Aborted", () => {
    expect(canTransition(STATES.Clearing, STATES.Aborted)).toBe(false);
  });

  it("should allow transition from Aborted to Aborting", () => {
    expect(canTransition(STATES.Aborted, STATES.Aborting)).toBe(false);
  });

  it("should allow transition from Aborting to Starting", () => {
    expect(canTransition(STATES.Aborting, STATES.Starting)).toBe(false);
  });

  it("should allow transition from Starting to Execute", () => {
    expect(canTransition(STATES.Starting, STATES.Execute)).toBe(true);
  });

  it("should allow transition from Execute to Stopping", () => {
    expect(canTransition(STATES.Execute, STATES.Stopping)).toBe(true);
  });

  it("should allow transition from Stopping to Complete", () => {
    expect(canTransition(STATES.Stopping, STATES.Complete)).toBe(false);
  });

  it("should allow transition from Complete to Idle", () => {
    expect(canTransition(STATES.Complete, STATES.Idle)).toBe(false);
  });

  it("should not allow invalid transition", () => {
    expect(canTransition(STATES.Stopped, STATES.Complete)).toBe(false);
  });
});
