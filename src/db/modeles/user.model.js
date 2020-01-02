const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const userScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 50},
	email: {type: String, required: true, minlength: 5, maxlength: 255, unique: true},
	password: {type: String, required: true, minlength: 5, maxlength: 1024},
});

const validateCommonObj = {
	name: Joi.string().min(5).max(50).required(),
	email: Joi.string().min(5).max(255).required().email(),
	password: Joi.string().min(5).max(255).required(),
};
const validateIdObj = {
	id: Joi.objectId()
};

function validate(objToValidate) {
	return Joi.object(validateCommonObj).validate(objToValidate)
}

validate.validateId = function (objToValidate) {
	return Joi.object(validateIdObj).validate(objToValidate)
};

const Model = mongoose.model('User', userScheme);

module.exports = {Model, validate};
