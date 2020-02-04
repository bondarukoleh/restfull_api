const {HOST='localhost', APP_PORT=3000, NODE_ENV} = process.env;

const Urls = {
	genres: '/api/genres',
	customers: '/api/customers',
	movies: '/api/movies',
	rentals: '/api/rentals',
	users: '/api/users',
	auth: '/api/auth',
};

const local = `http://${HOST}:${APP_PORT}`;
const production = `https://olehbondaruk-movies-api.herokuapp.com`;
const host = NODE_ENV === 'production' ? local : production;

module.exports = {Urls, host};
