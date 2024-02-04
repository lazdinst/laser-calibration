# PID Application & Simulator

This versatile solution is designed to address the need for continuous calibration in diverse scenarios. It is a response to a coding challenge posed by a company seeking precise hardware control amidst a complex environment with numerous variables affecting system output.

## Requirements

- `node v18.17.1`

### Repository Structure

- `src/`: Contains the source code for the laser calibration solution.
- `tests/`: Includes unit tests to ensure the correctness and robustness of the code.
- `runme.sh`: A script to execute the algorithm with example data and produce outputs.

### Core Components

#### Simulation Manager

The Simulation Manager orchestrates the entire PID control loop process. It initializes the PID Controller with configuration settings, runs the simulation, and optionally generates plots based on simulation results. This component serves as the main control hub for the calibration process.

#### PID Controller

The PID Controller implements the Proportional-Integral-Derivative (PID) control algorithm. It continuously calculates control outputs based on error values and control gains. This component plays a crucial role in adjusting the system to achieve optimal calibration.

#### Simulator

The Simulator models the behavior of a system influenced by a PID controller. It runs simulations for a specified number of steps, updating the system's behavior and recording results. This component simulates real-world scenarios, allowing for testing and optimization.

#### Plot Generator

The Plot Generator provides simple visualizations of simulation results in the terminal. It generates Lo-Fi data visualizations to help understand the behavior of the system and the PID controller's influence. These visualizations aid in analyzing calibration performance.

### Auto-Run

To quickly set up and run the application, you can use the `runme.sh` script. This script performs the following tasks:

- Installs required packages from `package.json`.
- Executes the test suite to ensure the application's correctness.
- Starts the application instance loop, monitoring `src/pid-config` changes.

### CLI Commands

- `npm install`: Installs packages from `package.json`, generating necessary node modules and a lock file.
- `npm run start`: Starts the application instance loop, monitoring configuration changes and executing the calibration process.
- `npm run test`: Executes the test suite for the application, verifying its functionality and reliability.

## Simulation Results

The simulation results are stored in the `simulation_results.csv` file. This file contains valuable data regarding the calibration process and can be analyzed to assess the system's performance.

Feel free to explore and adapt this solution for your specific calibration needs. It offers flexibility and control for achieving precise and continuous calibration in various applications.
