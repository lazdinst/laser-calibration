class PIDController {
  private kp: number; // Proportional gain
  private ki: number; // Integral gain
  private kd: number; // Derivative gain

  private integral: number = 0;
  private previousError: number = 0;
  private setPoint: number;

  constructor(kp: number, ki: number, kd: number) {
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
    this.setPoint = 0;
  }

  /**
   * Initializes or re-initializes the PID controller with new gain values and set point.
   * This method can be used to reset the PID parameters and internal states.
   * @param kp Proportional gain.
   * @param ki Integral gain.
   * @param kd Derivative gain.
   * @param setPoint The desired target value the controller will aim to achieve.
   */
  public initializePIDValues(
    kp: number,
    ki: number,
    kd: number,
    setPoint: number
  ): void {
    // Set the new gain values
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;

    // Set the new set point
    this.setPoint = setPoint;

    // Reset the integral and previous error to start fresh with the new settings
    this.integral = 0;
    this.previousError = 0;
  }

  public setSetPoint(setPoint: number) {
    this.setPoint = setPoint;
  }

  /**
   * Updates the PID controller with the latest measurement and returns the control output.
   * @param currentValue The latest measurement or reading.
   * @returns The control output that should be applied to the system.
   */

  public update(currentValue: number): number {
    // Calculate the error as the difference between the set point and the current value.
    // The set point is the desired value we are trying to achieve, and the current value
    // is the latest measurement or reading. The error represents how far off we are from the desired target.
    let error = this.setPoint - currentValue;

    // Update the integral value by adding the current error.
    // The integral term is a sum of all past errors. It represents the accumulated offset
    // that should have been corrected previously. This term is used to reduce steady-state error.
    this.integral += error;

    // Calculate the derivative, which is the difference between the current error and the previous error.
    // The derivative term predicts the future trend of the error, based on its current rate of change.
    // It helps in bringing the error to zero more rapidly and in minimizing overshoot.
    let derivative = error - this.previousError;

    // Update the previous error with the current error for the next iteration.
    // This is necessary for the next derivative calculation.
    this.previousError = error;

    // Return the PID control output, which is the sum of the proportional, integral, and derivative terms.
    // The proportional term (kp * error) deals with present values of the error.
    // The integral term (ki * this.integral) counters accumulated past errors.
    // The derivative term (kd * derivative) predicts future errors.
    // This control output will be used to adjust the system in order to minimize the error.
    return this.kp * error + this.ki * this.integral + this.kd * derivative;
  }
}

export default PIDController;
