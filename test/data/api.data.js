const {HOST='localhost', PORT=3000} = process.env;

const Urls = {
	genres: '/api/genres',
	customers: '/api/customers',
	movies: '/api/movies',
	rentals: '/api/rentals',
	users: '/api/users',
	auth: '/api/auth',
};

const host = `http://${HOST}:${PORT}`;

module.exports = {Urls, host};
