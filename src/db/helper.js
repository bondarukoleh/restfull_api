const Joi = require('@hapi/joi');
const validObjectId = function () {
	return Joi.string().regex(/^[0-9a-fA-F]{24}$/).required();
}

module.exports = {validObjectId};
