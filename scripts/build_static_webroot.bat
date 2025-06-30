@echo off
setlocal
set "OLD_DIR=%cd%"
cd /d "%~dp0"

docker build -f ../DockerfileStaticResources -t mastermind-vue-build-static ..

docker create --name temp-mastermind-vue-container mastermind-vue-build-static

if exist ../build-output rmdir /s /q ../build-output
mkdir ../build-output
echo. > ../build-output\.gitkeep

docker cp temp-mastermind-vue-container:/app/dist ../build-output
docker rm temp-mastermind-vue-container > nul

cd /d "%OLD_DIR%"
endlocal
