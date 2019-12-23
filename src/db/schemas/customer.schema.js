const customerScheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: {type: Boolean, default: false},
	phone: {type: String, required: true, minlength: 11, maxlength: 13},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
};

module.exports = customerScheme;
