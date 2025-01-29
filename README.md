# Ecommerce App with Nest.js and Postgres

## Description
This project is an ecommerce application built using Nest.js and Postgres. The focus is on writing clean, modular, and testable code, and following a well-organized project structure.

## Technology Stack

- Nest.js
- PostgreSQL
- TypeORM
- Jest

## Getting Started

To get started with this project, follow these steps:

- Clone this repository to your local machine.
- navigate to the nestjs-ecommerce directory.

```bash 
cd ./nestjs-ecommerce
```
- start postgres database.


- install app dependencies.

```bash
yarn install
```

- run database migrations.

```bash
 yarn orm:mig:run
```
if you want to generate any future migration

```bash
yarn orm:mig:gen --name=<migrationName>
```

- run database seeders.

```bash
yarn seed:run
```

- start the applictaion.

```bash
yarn start:dev
```

## Testing
To run the tests, follow these steps:
1. Install dependencies: `yarn install`
2. Run the tests: `yarn run test`

## Contributing
If you're interested in contributing to this project, please follow these guidelines:
1. Fork the repository
2. Make your changes
3. Submit a pull request
