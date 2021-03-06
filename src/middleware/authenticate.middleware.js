const jwt = require('jsonwebtoken');
const {jwt_ppk} = require('config');

function isUser(req, res, next) {
	const token = req.header('x-auth-token');
	if (!token) return res.status(401).send({error: 'Unauthorized. No token.'});

	try {
		req.user = jwt.verify(token, jwt_ppk);
		next();
	} catch (e) {
		return res.status(400).send({error: 'Invalid token.'});
	}
}

function isAdmin(req, res, next) {
	if (!req.user.isAdmin) return res.status(403).send({error: 'Forbidden. You have no rights to perform this operation.'});
	next();
}

module.exports = {isUser, isAdmin};
