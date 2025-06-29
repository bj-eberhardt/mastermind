docker build -t mastermind-vue-build .
docker create --name temp-mastermind-vue-container mastermind-vue-build

rm -rf ./build-output
mkdir -p ./build-output
touch ./build-output/.gitkeep

docker cp temp-mastermind-vue-container:/app/dist ./build-output
docker rm temp-mastermind-vue-container
echo "✅ Build complete. Output in ./build-output"