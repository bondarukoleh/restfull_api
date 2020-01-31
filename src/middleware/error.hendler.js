const winston = require('winston');
const Joi = require('@hapi/joi');
const {validObjectId} = require('../db/helper');

function commonErrorHandler(err, req, res, next) {
	winston.error(`Basic error handler middleware caught error: ${err.message}`);
	res.status(500).send({error: err.message});
	next();
}

function mongoIdIsValid(req, res, next) {
	const {error} = Joi.object({id: validObjectId()}).validate(req.params);
	if(error) res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	next();
}

module.exports = {commonErrorHandler, mongoIdIsValid};
