const Mongoose = require('./mongoose.client');

const db = {
	client: new Mongoose(),
	models: require('./modeles'),
};

module.exports = db;
