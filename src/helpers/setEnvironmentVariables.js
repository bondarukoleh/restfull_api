const winston = require('winston');

/* TODO: refactor require('winston') to getLogger */

function createStartErrorLog() {
	winston.add(new winston.transports.File({filename: 'logs/startup.error.log', format: winston.format.json(), timestamp:true}));
	winston.add(new winston.transports.Console({colorize: true, prettyPrint: true}));
}

function throwSetupErrorCausedBy(variableName) {
	/* Need to investigate why winston cannot create file if I'm terminating process or throwing error immediately */
	setTimeout(() => {
		throw new Error(`"${variableName}" is missing. Please check start.local.app.sh.dist file! Your action REQUIRED!`)
	}, 2000)
}

function setEnvironmentVariables() {
	const {DB_USER_NAME, DB_USER_PASS, NODE_CONFIG_DIR, JWT_PPK} = process.env;
	for(const [key, value] of Object.entries({DB_USER_NAME, DB_USER_PASS, NODE_CONFIG_DIR, JWT_PPK})){
		if(!value){
			createStartErrorLog();
			winston.error(`ATTENTION! ${key} should be set. Please check out start.local.app.sh.dist file!`);
			throwSetupErrorCausedBy(key)
		}
	}
}

module.exports = {setEnvironmentVariables};
