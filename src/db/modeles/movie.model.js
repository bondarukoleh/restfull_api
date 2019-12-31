const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {validIdRegex} = require("../common.db.data");

const {genreScheme} = require('./genre.model');

// db data validation
const movieScheme = new mongoose.Schema({
	title: {type: String, required: true, minlength: 5, maxlength: 255, trim: true},
	genre: {type: genreScheme, required: true},
	numberInStock: {type: Number, default: 0, required: true, min: 0, max: 255},
	dailyRentalRate: {type: Number, default: 0, required: true, min: 0, max: 255}
});

// client data validation
const validate = function(objToValidate){
	const validationObj = Joi.object({
		title: Joi.string().min(5).max(30).required(),
		numberInStock: Joi.number().min(0).max(255).required(),
		dailyRentalRate: Joi.number().min(0).max(255).required(),
		genreId: Joi.string().regex(validIdRegex).required(),
	});
	return validationObj.validate(objToValidate)
};

const Model = mongoose.model('Movie', movieScheme);

module.exports = {Model, validate, movieScheme};
