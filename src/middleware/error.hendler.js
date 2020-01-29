const winston = require('winston');

function commonErrorHandler(err, req, res, next) {
	winston.error(`Basic error handler middleware caught error: ${err.message}`);
	res.status(500).send({error: err.message});
	next();
}

function mongoIdCheck(req, res, next) {
	const {error} = validate.validateId(req.params);
	if(error) res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	next();
}

module.exports = {commonErrorHandler, mongoIdCheck};
