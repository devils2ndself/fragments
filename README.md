# Fragments

REST API microservice for managing small pieces of data

## Commands

### Server

- `npm start`  
  Starts the server in production mode. Append ':mock' if you would like to use Basic Auth.

- `npm run dev`  
  Starts the server in development mode for better logging and automatic restart when files in `src` folder are changed. Append ':mock' if you would like to use Basic Auth.

- `npm run debug`  
  Starts the server in dev mode and allows for debugger to be added - Start via VSCode `Debug`. Append ':mock' if you would like to use Basic Auth.

- `npm run test:integration`
  Run HURL integration tests. Requires app to be running

- `npm run test`
  Run jest unit tests  

- `npm run test:watch`
  Rerun tests after every file save

- `npm run coverage`
  Display unit test coverage

- `npm run lint`  
  Checks for any errors or warnings via ESLint

### Docker

You can use docker-compose with a script for DynamoDB and S3 setup locally.
```
docker-compose up -d
./scripts/local-aws-setup.sh
```

If you would like to have MinIO for monitoring local S3, run
```
docker-compose -f docker-compose.local.yml up -d
```

## Notes (for myself)

- Keep the project clean  
  Source code in `src`, config to root

- Prettier is set up, so everything will be formatted upon saving
