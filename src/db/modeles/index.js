const dbModels = {
	customer: require('./customer.model'),
	genre: require('./genre.model'),
	movie: require('./movie.model'),
	rental: require('./rental.model'),
	user: require('./user.model'),
	auth: require('./auth.model'),
};

module.exports = dbModels;
