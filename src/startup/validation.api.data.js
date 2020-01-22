const Joi = require('@hapi/joi');

module.exports = function() {
	const {validObjectId} = require('../db/helper');
	Joi.objectId = validObjectId;
};
