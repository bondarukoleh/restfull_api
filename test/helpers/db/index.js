const DBClient = require('./db.client');

const db = {
	client: new DBClient()
};

module.exports = db;
