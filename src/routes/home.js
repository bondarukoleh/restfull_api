const express = require('express');
const router = express.Router();
const routes = require('./routes');

router.get('/', (req, res) => {
	return res.render('index', {title: 'Express app', message: 'Hi man!'});
});

module.exports = {url: routes.home, handler: router};
