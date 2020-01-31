const debug = require('debug');

module.exports = function (server, dbClient) {
	server.on('close', async (err) => {
		const log = debug('app:closing');
		if(err) {
			log(`Closing app with error ${err}`);
		}
		log(`Disconnecting DB`);
		dbClient.disconnect().catch(err => log(`DB is not disconnected ${err.message}`))
	});
};
