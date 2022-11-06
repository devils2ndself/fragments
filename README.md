# Fragments

REST API microservice for managing small pieces of data

## Commands

### Server

- `npm start`  
  Starts the server in production mode

- `npm run dev`  
  Starts the server in development mode for better logging and automatic restart when files in `src` folder are changed

- `npm run debug`  
  Starts the server in dev mode and allows for debugger to be added - Start via VSCode `Debug`

- `npm run test`
  Run jest unit tests

- `npm run test:watch`
  Rerun tests after every file save

- `npm run coverage`
  Display unit test coverage

- `npm run lint`  
  Checks for any errors or warnings via ESLint

### Docker

- `docker build -t fragments .`
  Build docker image

- `docker run --rm --init [--env-file <environment file>] -p 8080:8080 [-e LOG_LEVEL=debug] [-d | -it] fragments`
  Run docker image (-d for running in background, -it for interactive shell)

## Notes (for myself)

- Keep the project clean  
  Source code in `src`, config to root

- Prettier is set up, so everything will be formatted upon saving
