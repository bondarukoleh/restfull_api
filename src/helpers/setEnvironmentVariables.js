const path = require('path');

function setEnvironmentVariables() {
	console.log('Setting env vars...');
	process.env.NODE_CONFIG_DIR = path.resolve(process.cwd(), 'src/config'); // for config package, maybe will change it with time
	require('dotenv-safe').config({allowEmptyValues: true, example: path.resolve(process.cwd(), '.env')});

	const {DB_USER_NAME, DB_USER_PASS} = process.env;
	if(!DB_USER_NAME || !DB_USER_PASS || true) {
		console.warn('\x1b[33mDB USER or PASSWORD not set. Please check out .env.dist file! \x1b[89m');
		console.warn('\x1b[33mYou are not able to use DB! \x1b[89m');
		console.log("\x1b[0m"); // to reset color
		console.log("\x1b[0m"); // to reset color
	}
}

module.exports = {setEnvironmentVariables};
