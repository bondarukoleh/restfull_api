const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: {type: Boolean, default: false},
	phone: {type: String, required: true, minlength: 11, maxlength: 13},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
});

const validateCommonObj = {
	name: Joi.string().min(5).required(),
	phone: Joi.string().required(),
	isGold: Joi.boolean(),
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

const Model = mongoose.model('Customer', customerScheme);

module.exports = {Model, validate, customerScheme};
