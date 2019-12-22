const genreScheme = {
	name: {type: String, required: true, minlength: 5, maxlength: 20},
	tags: {type: Array,
		// validate: {
			// validator(v){return Array.isArray(v) && v.length > 0},
			// message: `Value should be not empty array`
		// },
		required: false},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
}

module.exports = genreScheme;
