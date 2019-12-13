const path = require('path');

function setEnvironmentVariables() {
	try {
		require('dotenv-safe').config({allowEmptyValues: true, example: path.resolve(process.cwd(), '.env')});
	} catch (e) {
		throw new Error('ERROR! Please check .env.dist file! Your action REQUIRED!');
	}

	const {DB_USER_NAME, DB_USER_PASS, NODE_CONFIG_DIR} = process.env;
	if(!NODE_CONFIG_DIR){
		console.log('ATTENTION! NODE_CONFIG_DIR should be set. Please check out .env.dist file!')
	}
	if(!DB_USER_NAME || !DB_USER_PASS) {
		console.warn('ATTENTION! DB USER or PASSWORD not set. Please check out .env.dist file!');
		console.warn('ATTENTION! You are not able to use DB!');
	}
}

module.exports = {setEnvironmentVariables};
