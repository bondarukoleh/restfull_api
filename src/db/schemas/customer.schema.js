const customerScheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	isGold: Boolean,
	phone: {type: String, required: true},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
};

module.exports = customerScheme;
