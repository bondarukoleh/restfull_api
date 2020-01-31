const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const {genreScheme} = require('./genre.model');
const {validObjectId} = require('../helper');

// db data validation
const movieScheme = new mongoose.Schema({
	title: {type: String, required: true, minlength: 5, maxlength: 255, trim: true},
	genre: {type: genreScheme, required: true},
	numberInStock: {type: Number, default: 0, required: true, min: 0, max: 255},
	dailyRentalRate: {type: Number, default: 0, required: true, min: 0, max: 255}
});

const validateCommonObj = {
	title: Joi.string().min(5).max(30).required(),
	numberInStock: Joi.number().min(0).max(255).required(),
	dailyRentalRate: Joi.number().min(0).max(255).required(),
	genreId: validObjectId(),
};

// client data validation
function validate(objToValidate) {
	return Joi.object(validateCommonObj).validate(objToValidate)
}

const Model = mongoose.model('Movie', movieScheme);

module.exports = {Model, validate, movieScheme};
