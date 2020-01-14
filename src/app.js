require('./helpers').common.setEnvironmentVariables();
require('express-async-errors');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const log = require('debug')('app:startup');
const Joi = require('@hapi/joi');

const {validObjectId} = require('./db/helper');
Joi.objectId = validObjectId;
const {app_port, debug_app, name} = config;
const {genres, multiple, home, customers, movies, rental, users, auth} = require('./routes');
const {client} = require('./db');
const {errorHandle: {commonErrorHandler}} = require('./middleware');

const app = express();

// DB
client.connect().then(() => log('DB connected'), (e) => log(`DB is NOT connected.\n"${e.message}"`));

// Middleware
app.use(express.json()); // for application/json
app.use(express.urlencoded({extended: true})); // for application/x-www-form-urlencoded
app.use(express.static('./src/public')); // static serving from public folder
app.use(helmet()); // increases security
app.set('view engine', 'pug');
app.set('views', './src/views'); // views set by default - here for example

// Logging
debug_app && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`)); // logger, writes to terminal but could be setup to file
log(`app is in: ${app.get('env')}`); //if NODE_ENV isn't set - development, otherwise - it's value. Needs to be set before app
log(`App name: ${name}`);

// Routers
app.use(home.url, home.handler);
app.use(genres.url, genres.handler);
app.use(multiple.url, multiple.handler);
app.use(customers.url, customers.handler);
app.use(movies.url, movies.handler);
app.use(rental.url, rental.handler);
app.use(users.url, users.handler);
app.use(auth.url, auth.handler);

// error handler
app.use(commonErrorHandler);

app.listen(app_port, () => console.log(`App listening on port ${app_port}.`));
