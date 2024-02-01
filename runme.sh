#!/bin/bash

# Stop the script if any command fails
set -e

# Install npm dependencies
echo "Installing npm dependencies..."
npm install

# Run the test:start script
echo "Running tests..."
npm run test:start

echo "Run me script initiated."
