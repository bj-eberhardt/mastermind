#!/bin/bash

OLD_DIR=$(pwd)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

docker build -f ../DockerfileStaticResources -t mastermind-vue-build-static ..
docker create --name temp-mastermind-vue-container mastermind-vue-build-static

rm -rf ../build-output
mkdir -p ../build-output
touch ../build-output/.gitkeep

docker cp temp-mastermind-vue-container:/app/dist ../build-output
docker rm temp-mastermind-vue-container
echo "✅ Build complete. Output in ./build-output"
cd "$OLD_DIR"