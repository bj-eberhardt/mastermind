# Mastermind

The game "Mastermind" or also called "SuperHirn" implemented with Vue3 and TailwindCss.



# Deployment

## Served in webserver

Create docker image with binding to port 8080.
```` 
docker build -t mastermind-vue .
docker run -d -p 8080:80 --name test-container mastermind-vue
````
You can access it then via http://localhost:8080/

## Create static resources

Run the script `./scripts/build_static_webroot.bat` or `./scripts/build_static_webroot.sh`.
It's building the vue project and puts the necessary created static resources into folder 'build-output'.
Now you can host it wherever you want.


# Development

Use nvm or use the necessary node version from `.nvmrc` file.

You can start the dev server via `npm run dev`.

You can format and lint the code via `npm run check`.

You can build the static resources via `npm run build`.


