const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {validIdRegex} = require("../common.db.data");

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
	id: Joi.string().regex(validIdRegex).required()
};

const validatePost = function(objToValidate){
	const validationObj = Joi.object(validateCommonObj);
	return validationObj.validate(objToValidate)
};

const validatePut = function(objToValidate){
	const validationObj = Joi.object(validateCommonObj);
	return validationObj.validate(objToValidate)
};

const validateId = function(objToValidate){
	const validationObj = Joi.object(validateIdObj);
	return validationObj.validate(objToValidate)
};

const validate = {validatePost, validatePut, validateId};
const Model = mongoose.model('Customer', customerScheme);

module.exports = {Model, validate, customerScheme};
