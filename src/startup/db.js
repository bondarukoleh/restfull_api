const log = require('debug')('app:startup:db'); // default express logger

module.exports = function(client) {
	client.connect().then(() => log('DB connected'),
		(e) => {
			log(`DB is not connected!!!\n"${e.message}"`);
			// let the app terminates and winston exception handler - deal with this error
			throw e;
		});
};
