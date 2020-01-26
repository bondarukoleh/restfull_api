require('./helpers').common.setEnvironmentVariables();
require('express-async-errors');
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const winston = require('winston');

require('./startup/validation.api.data')();
const {app_port, debug_app} = config;
const {pluginRoutes, pluginMiddleware, connectDB, addLogging, handleExceptions} = require('./startup');
const {client} = require('./db');

const app = express();

// Logging
addLogging();
// morgan writes to terminal but could be setup to file
debug_app && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`));

// exceptions
handleExceptions();

// DB
connectDB(client);

// Middleware
pluginMiddleware(app);

// Routers
pluginRoutes(app);

app.listen(app_port, () => winston.info(`App listening on port ${app_port}.`));
