const genreScheme = {
	name: {type: String, required: true},
	tags: {type: Array, validate: {
			validator(v){return Array.isArray(v) && v.length > 0},
			message: `Value should be not empty array`
		}},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
	isPublished: Boolean,
	price: Number
};

const customerScheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: Boolean,
	phone: {type: String, required: true, minlength: 11, maxlength: 13},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
};

module.exports = {genreScheme, customerScheme};
