require('./helpers').common.setEnvironmentVariables();
require('express-async-errors');
const express = require('express');
const config = require('config');
const morgan = require('morgan');
const winston = require('winston');

const {app_port, debug_app, name} = config;
const {pluginRoutes, pluginMiddleware, connectDB, addLogging, handleExceptions, appListeners} = require('./startup');
const {client} = require('./db');

const app = express();

// Logging
addLogging();
// morgan writes to terminal but could be setup to file. Condition is screwed up, but config - returns string not bool
debug_app !== 'false' && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`));
// exceptions
handleExceptions();

// DB
connectDB(client);

// Middleware
pluginMiddleware(app);

// Routers
pluginRoutes(app);

// TODO: rewrite to make more clear and pretty
function getServer(port = process.env.PORT || app_port){
	const server = app.listen(port,
		() => winston.info(`App ${name} is listening on port ${app_port}.`));
	appListeners(server, client);
	return server;
}

module.exports = process.env.NODE_ENV === 'test' ? getServer : getServer();
