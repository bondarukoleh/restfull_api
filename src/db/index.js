const Mongoose = require('./mongoose');

const db = {
	client: new Mongoose()
};

module.exports = db;
