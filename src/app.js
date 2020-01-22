require('./helpers').common.setEnvironmentVariables();
require('express-async-errors');
const express = require('express');
const config = require('config');
const Joi = require('@hapi/joi');
const morgan = require('morgan');

const {validObjectId} = require('./db/helper');
Joi.objectId = validObjectId;
const {app_port, debug_app} = config;
const {pluginRoutes, pluginMiddleware, connectDB, addLogging, handleExceptions} = require('./startup');
const {client} = require('./db');

const app = express();

// Logging
addLogging();
debug_app && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`));

// exceptions
handleExceptions();

// DB
connectDB(client);

// Middleware
pluginMiddleware(app);

// Routers
pluginRoutes(app);

app.listen(app_port, () => console.log(`App listening on port ${app_port}.`));
