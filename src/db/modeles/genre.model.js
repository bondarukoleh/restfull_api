const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const scheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	tags: {type: Array,
		// validate: {
		// validator(v){return Array.isArray(v) && v.length > 0},
		// message: `Value should be not empty array`
		// },
		required: false},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
};

const validate = function(objToValidate){
	const validationObj = Joi.object({
		name: Joi.string().min(3).required(),
	});
	return validationObj.validate(objToValidate)
};

const Model = mongoose.model('Genre', new mongoose.Schema(scheme));

module.exports = {Model, validate};
