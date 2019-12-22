const Mongoose = require('./mongoose.client');

const db = {
	client: new Mongoose(),
	schemas: require('./schemas'),
};

module.exports = db;
