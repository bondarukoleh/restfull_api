const {HOST = 'localhost', PORT = 3000} = process.env;

const commonHeaders = {
	'Content-Type': 'application/json'
};

const Urls = {
	courses: '/api/courses',
};

const host = `http://${HOST}:${PORT}`;

module.exports = {commonHeaders, Urls, host};
