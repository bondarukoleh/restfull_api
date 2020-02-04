const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const moment = require('moment');
const {validObjectId} = require('../helper');

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

/* Pay attention to add static method to class - .statics */
rentalScheme.statics.lookup = function (customerId, movieId) {
	/* Funny way to get inner property of object in mongoose - via dot notation */
	return this.findOne({'customer._id': customerId, 'movie._id': movieId})
};

/* Pay attention to add instance methods to object - .methods */
rentalScheme.methods.makeReturned = function () {
	this.dateReturned = new Date();
	const daysInRent = moment().diff(this.dateOut, 'days');
	this.rentFee = daysInRent * this.movie.dailyRentalRate;
};

const validateCommonObj = {
	customerId: validObjectId(),
	movieId: validObjectId(),
};

function validate(objToValidate) {
	return Joi.object(validateCommonObj).validate(objToValidate)
}

const Model = mongoose.model('Rental', rentalScheme);

module.exports = {Model, validate};
