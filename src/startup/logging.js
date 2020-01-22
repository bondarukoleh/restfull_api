
const winston = require('winston');
require('winston-mongodb');

module.exports = function() {
	winston.add(new winston.transports.File({filename: 'logs/appLog.log', format: winston.format.json()}));
	winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));
	/* will log errors to db */
	/* winston.add(new winston.transports.MongoDB({db: client.connectionUrl, level: 'error'})); */
	/* will log all uncaughtException */
	winston.exceptions.handle(new winston.transports.File({filename: 'logs/exceptions.log',
		format: winston.format.json()}));
};
