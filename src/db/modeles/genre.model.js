const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const genreScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
});

const validate = function(objToValidate){
	const validationObj = Joi.object({
		name: Joi.string().min(3).required(),
	});
	return validationObj.validate(objToValidate)
};

const Model = mongoose.model('Genre', genreScheme);

module.exports = {Model, validate, genreScheme};
