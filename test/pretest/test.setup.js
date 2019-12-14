const db = require('../helpers/db');

before(async function() {
	await db.client.connect();
	console.log('PRETEST DONE');
	return db.client.disconnect();
});
