const {genres, multiple, home, customers, movies, rental, users, auth} = require('../routes');
const {errorHandle: {commonErrorHandler}} = require('../middleware');

module.exports = function(app) {
	app.use(home.url, home.handler);
	app.use(genres.url, genres.handler);
	app.use(multiple.url, multiple.handler);
	app.use(customers.url, customers.handler);
	app.use(movies.url, movies.handler);
	app.use(rental.url, rental.handler);
	app.use(users.url, users.handler);
	app.use(auth.url, auth.handler);
	app.use(commonErrorHandler);
};
