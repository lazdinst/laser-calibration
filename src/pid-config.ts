export default {
  kp: 0.1, // Offest from setPoint
  ki: 0.01, // Past Error
  kd: 0.1, // Future Error
  setPoint: 1, // Set point
  initialOutput: 0, // Initial output
  steps: 100, // Number of steps; For Terminal Plots recommended <175; scales with windowsize
  noiseFactor: 0.1, // Noise factor
  ENABLE_PLOT: true, // Enable plot
  plotHeight: 16, // Plot Size
};
