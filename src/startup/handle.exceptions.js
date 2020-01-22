const log = require('debug')('app:startup'); // default express logger
const winston = require('winston');

module.exports = function() {
	/* This only helps when sync code has error. It won't catch rejected Promise */
	process.on('uncaughtException', (err) => {
		log(`Got Uncaught Exception: ${err.message}`);
		winston.error(`Got Uncaught Exception: ${err.message}`)
		/* Better to exit in those cases, to not left app in not clear state */
		// process.exit(1)
	});

	process.on('unhandledRejection', (err) => {
		/* Here we catching the async error, and we'll make a sync error from it */
		log(`Got Unhandled Rejection: ${err.message}`);
		throw err;
	});
};

