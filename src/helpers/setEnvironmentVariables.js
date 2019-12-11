const path = require('path');

function setEnvironmentVariables() {
	console.log('Setting env vars...');
	process.env.NODE_CONFIG_DIR = path.resolve(process.cwd(), 'src/config'); // for config package, maybe will change it with time
	try {
		require('dotenv-safe').config({allowEmptyValues: true, example: path.resolve(process.cwd(), '.env')});
	} catch (e) {
		throw new Error('ERROR! Please check .env.dist file! Your action REQUIRED!');
	}

	const {DB_USER_NAME, DB_USER_PASS} = process.env;
	if(!DB_USER_NAME || !DB_USER_PASS) {
		console.warn('ATTENTION! DB USER or PASSWORD not set. Please check out .env.dist file!');
		console.warn('ATTENTION! You are not able to use DB!');
	}
}

module.exports = {setEnvironmentVariables};
