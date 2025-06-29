@echo off
setlocal

docker build -t mastermind-vue-build .

docker create --name temp-mastermind-vue-container mastermind-vue-build

if exist build-output rmdir /s /q build-output
mkdir build-output
echo. > build-output\.gitkeep

docker cp temp-mastermind-vue-container:/app/dist ./build-output
docker rm temp-mastermind-vue-container > nul

endlocal
pause
