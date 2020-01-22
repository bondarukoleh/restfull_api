require('./helpers').common.setEnvironmentVariables();
require('express-async-errors');
const express = require('express');
const morgan = require('morgan');
const config = require('config');
const log = require('debug')('app:startup'); // default express logger
const Joi = require('@hapi/joi');
const winston = require('winston');
require('winston-mongodb');

const {validObjectId} = require('./db/helper');
Joi.objectId = validObjectId;
const {app_port, debug_app, name} = config;
const {pluginRoutes, pluginMiddleware, connectDB} = require('./startup');
const {client} = require('./db');

const app = express();

// Logging
winston.add(new winston.transports.File({filename: 'logs/appLog.log', format: winston.format.json()}));
/* will log errors to db winston.add(new winston.transports.MongoDB({db: client.connectionUrl, level: 'error'})); */
/* will log all uncaughtException */
winston.exceptions.handle(new winston.transports.File({filename: 'logs/exceptions.log',
	format: winston.format.json()}));

/* This only helps when sync code has error. It won't catch rejected Promise */
process.on('uncaughtException', (err) => {
	log(`Got Uncaught Exception: ${err.message}`);
	winston.error(`Got Uncaught Exception: ${err.message}`)
	/* Better to exit in those cases, to not left app in not clear state */
	// process.exit(1)
});

process.on('unhandledRejection', (err) => {
	/* Here we catching the async error, and we'll make a sync error from it */
	log(`Got Unhandled Rejection: ${err.message}`);
	throw err;
});

// DB
connectDB(client);

// Middleware
pluginMiddleware(app);




debug_app && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`)); // logger, writes to terminal but could be setup to file
log(`app is in: ${app.get('env')}`); //if NODE_ENV isn't set - development, otherwise - it's value. Needs to be set before app
log(`App name: ${name}`);

// Routers
pluginRoutes(app);

// error handler for request processing pipeline in context express.
// if something happens outside express - it won't help us

app.listen(app_port, () => console.log(`App listening on port ${app_port}.`));
