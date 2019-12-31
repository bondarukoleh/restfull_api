const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const {validIdRegex} = require('../common.db.data');

// Duplicating customer schema because we need only super needed info about them, and original customer schema
// can be extended with additional properties that we don't want to see here. But it's not a good approach, fix latter
const customerEssentialScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 50},
	isGold: {type: Boolean, default: false},
	phone: {type: String, required: true, minlength: 5, maxlength: 50},
});

const movieEssentialScheme = new mongoose.Schema({
	title: {type: String, required: true, minlength: 5, maxlength: 255, trim: true},
	dailyRentalRate: {type: Number, default: 0, required: true, min: 0, max: 255}
});

const rentalScheme = new mongoose.Schema({
	customer: {type: customerEssentialScheme, required: true},
	movie: {type: movieEssentialScheme, required: true},
	dateOut: {type: Date, default: Date.now, required: true},
	dateReturned: {type: Date},
	rentFee: {type: Number, min: 0},
});

const validate = function(objToValidate){
	const validationObj = Joi.object({
		customerId: Joi.string().regex(validIdRegex).required(),
		movieId: Joi.string().regex(validIdRegex).required(),
	});
	return validationObj.validate(objToValidate)
};

const Model = mongoose.model('Rental', rentalScheme);

module.exports = {Model, validate};
