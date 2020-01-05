const log = require('debug')('middleware:auth');
const jwt = require('jsonwebtoken');
const {jwt_ppk} = require('config');

function isUser(req, res, next) {
	log('Check Authentication...');
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).send('Access denied. No token.');

	try {
		req.user = jwt.verify(token, jwt_ppk);
		next();
	} catch (e) {
		return res.status(400).send('Invalid token.');
	}
}

function isAdmin(req, res, next) {
	log('Check if User is admin...');
	if (!req.user.isAdmin) return res.status(403).send('Forbidden. You have no rights to perform this operation.');
	next();
}

module.exports = {isUser, isAdmin};
