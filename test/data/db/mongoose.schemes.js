const mongoose = require('mongoose');

const genreScheme = new mongoose.Schema({
	name: {type: String, required: true},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
	isPublished: Boolean,
	price: Number
});

const customerScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: Boolean,
	phone: {type: String, required: true, minlength: 11, maxlength: 13},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
});

const movieScheme = new mongoose.Schema({
	title: {type: String, required: true, minlength: 5, maxlength: 255, trim: true},
	genre: {type: genreScheme, required: true},
	numberInStock: {type: Number, default: 0, required: true, min: 0, max: 255},
	dailyRentalRate: {type: Number, default: 0, required: true, min: 0, max: 255}
});

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

const userScheme = new mongoose.Schema({
	name: {type: String, required: true, minlength: 5, maxlength: 50},
	email: {type: String, required: true, minlength: 5, maxlength: 255, unique: true},
	password: {type: String, required: true, minlength: 5, maxlength: 1024},
	isAdmin: {type: Boolean, required: true},
});

module.exports = {genreScheme, customerScheme, movieScheme, rentalScheme, userScheme};
