const Joi = require('@hapi/joi');

const validateCommonObj = {
	email: Joi.string().min(5).max(255).required().email(),
	password: Joi.string().min(5).max(255).required(),
};

function validate(objToValidate) {
	return Joi.object(validateCommonObj).validate(objToValidate)
}

module.exports = {validate};
