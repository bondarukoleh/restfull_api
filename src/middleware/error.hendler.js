const winston = require('winston');

function commonErrorHandler(err, req, res, next) {
	winston.error(`Basic error handler middleware caught error: ${err.message}`, err);
	res.status(500).send({error: err.message});
	next();
}

module.exports = {commonErrorHandler};
