const logger = require('./logger');
logger.on('messageLogged', (message) => {
	console.log('messageLogged event was caught "%s"', message)
});
logger.log('This is message');
