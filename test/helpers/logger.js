const {configure, getLogger: getLoggerInstance} = require('log4js');

function getLogger({name = 'Logger', level = 'info', color = true}) {
	configure({
		appenders: {
			out: {
				type: 'stdout',
				layout: {type: color ? 'coloured' : 'basic'},
			},
		},
		categories: {
			default: {
				appenders: ['out'],
				level,
			},
		},
	});

	return getLoggerInstance(name);
}

module.exports = getLogger;
