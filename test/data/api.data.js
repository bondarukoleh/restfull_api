const {HOST='localhost', PORT=3000} = process.env;

const commonHeaders = {
	'Content-Type': 'application/json'
};

const Urls = {
	genres: '/api/genres',
};

const host = `http://${HOST}:${PORT}`;

const Statuses = {
	200: 200,
	201: 201,
	204: 204,
	400: 400,
	404: 404
};

module.exports = {commonHeaders, Urls, host, Statuses};
