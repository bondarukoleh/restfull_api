const {HOST='localhost', APP_PORT=3000} = process.env;

const Urls = {
	genres: '/api/genres',
	customers: '/api/customers',
	movies: '/api/movies',
	rentals: '/api/rentals',
	users: '/api/users',
	auth: '/api/auth',
};

const host = `http://${HOST}:${APP_PORT}`;

module.exports = {Urls, host};
