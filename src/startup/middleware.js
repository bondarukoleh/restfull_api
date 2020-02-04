const express = require('express');
const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {
	app.use(express.json()); // for application/json
	app.use(express.urlencoded({extended: true})); // for application/x-www-form-urlencoded
	app.use(express.static('./src/public')); // static serving from public folder
	app.use(helmet()); // increases security
	app.use(compression()); // increases security
	app.set('view engine', 'pug');
	app.set('views', './src/views'); // views set by default - here for example
};
