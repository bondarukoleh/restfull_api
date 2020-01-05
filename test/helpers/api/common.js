const {api: {loginApi, usersApi}} = require('../../lib');

async function loginUser({email, password}) {
	const {body, status} = await loginApi.login({email, password});
	if(status !== 200 || !body.token) {
		throw new Error(`Couldn't get token for ${email}`)
	}
	return body.token;
}

module.exports = {loginUser};
