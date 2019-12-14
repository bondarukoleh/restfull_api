require('./helpers').common.setEnvironmentVariables();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');
const log = require('debug')('app:startup');

const {authentication} = require('./middleware');
const {app_port, debug_app, name} = config;
const {genre, multiple, home} = require('./routes');

const app = express();

// middleware
app.use(express.json()); // for application/json
app.use(express.urlencoded({extended: true})); // for application/x-www-form-urlencoded
app.use(express.static('./src/public')); // static serving from public folder
app.use(authentication);
app.use(helmet()); // increases security
app.set('view engine', 'pug');
app.set('views', './src/views'); // views set by default - here for example

// Logging
debug_app && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`)); // logger, writes to terminal but could be setup to file
log(`app is in: ${app.get('env')}`); //if NODE_ENV isn't set - development, otherwise - it's value. Needs to be set before app
log(`App name: ${name}`);

//Routers
app.use(home.url, home.handler);
app.use(genre.url, genre.handler);
app.use(multiple.url, multiple.handler);

app.listen(app_port, () => console.log(`App listening on port ${app_port}.`));
