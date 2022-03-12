## Hackathon Backend Server
> Hackathon API.

## Environment
```bash
$ cp .env.example .env
```

## Installation

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Generate Migration From Entity

```bash
$ yarn typeorm migration:generate -n  migrations_name
```

## Run Migration

```bash
$ yarn typeorm migration:run
```

## Rollback Migration 

```bash
$ yarn typeorm migration:revert
```

## Test

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Deployment(PM2)

```bash
# sync changes(for .env compare with .env.example)
1. git pull origin <branch>

# install dependencies
2. yarn

# build dist
3. yarn build

# run migration (if any)
4. yarn typeorm migration:run

# start service: 
5. pm2 start dist/main.js --name <name>:<port>
```

