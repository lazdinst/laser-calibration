export default {
  kp: 0.1,
  ki: 0.1,
  kd: 0.3,
  setPoint: 1, // Set point
  initialOutput: 0, //  Initial output
  steps: 175, // Number of steps; Terminal Plots unreadable past 175
  noiseFactor: 0.1, // Noise factor
  ENABLE_NOISE_MAGNIFIER: true, // Enable random noise magnifier
  noiseMagProbability: 0.995, // Probability of noise magnifier
  PLOT_HEIGHT: 16, // Plot Size
};
