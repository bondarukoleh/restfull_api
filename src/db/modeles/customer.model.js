const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const scheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: {type: Boolean, default: false},
	phone: {type: String, required: true, minlength: 11, maxlength: 13},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
};

const validate = function(objToValidate){
	const validationObj = Joi.object({
		name: Joi.string().min(5).required(),
		phone: Joi.string().required(),
		isGold: Joi.boolean(),
	});
	return validationObj.validate(objToValidate)
};

const Model = mongoose.model('Customer', new mongoose.Schema(scheme));

module.exports = {Model, validate};
