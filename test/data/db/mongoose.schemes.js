const genreScheme = {
	name: String,
	tags: [String],
	date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
	isPublished: Boolean,
	price: Number
}

module.exports = {genreScheme};
