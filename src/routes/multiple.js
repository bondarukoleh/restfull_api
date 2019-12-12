const express = require('express');
const router = express.Router();
const paths = require('./routes');

router.get('/', (req, res) => {
	return res.write(JSON.stringify(req.params)).send();
});

module.exports = {handler: router, url: paths.multiple};
