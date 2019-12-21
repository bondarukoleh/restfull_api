const genreScheme = {
	name: {type: String, required: true},
	tags: {type: Array, validate: {
			validator(v){return Array.isArray(v) && v.length > 0},
			message: `Value should be not empty array`
		}},
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
	isPublished: Boolean,
	price: Number
}

module.exports = {genreScheme};
