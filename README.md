# Project-Backend

This is a user login and registration app using Node.js, Express, Passport, Mongoose which includes an age prediction API that uses agify.io to send a response to the client. It has a local MongoDB connection and features cron jobs scheduled weekly.


## Initialize

Create a new project folder:

```
mkdir project-backend
cd project-backend
```
Initialize a package.json file:

```
npm init
```

## Install

Type: `npm install`

Installs all dependent npm packages locally.

## Run

Type: `npm server`

Runs the app in the development mode. Listens on http://localhost:5000. Server can be restarted by pressing 'rs' in command line.

## Setup local database

Type: `mongod`

Starts the MongoDB process and runs in it in the background.
