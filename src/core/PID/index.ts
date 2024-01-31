class PIDController {
  private kp: number; // Proportional gain
  private ki: number; // Integral gain
  private kd: number; // Derivative gain

  private integral: number = 0;
  private previousError: number = 0;
  private setPoint: number;

  constructor(kp: number, ki: number, kd: number, setPoint: number) {
    this.kp = kp;
    this.ki = ki;
    this.kd = kd;
    this.setPoint = setPoint;
  }

  public update(currentValue: number): number {
    let error = this.setPoint - currentValue;
    this.integral += error;
    let derivative = error - this.previousError;
    this.previousError = error;

    return this.kp * error + this.ki * this.integral + this.kd * derivative;
  }

  public setSetPoint(setPoint: number) {
    this.setPoint = setPoint;
  }
}
