function commonErrorHandler(err, req, res, next) {
	res.status(500).send({error: err.message});
	next();
}

module.exports = {commonErrorHandler};
