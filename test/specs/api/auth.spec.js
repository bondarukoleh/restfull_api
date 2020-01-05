const {expect} = require('chai');
const {api: {loginApi, usersApi}} = require('../../lib');
const {apiData: {Statuses}, usersData} = require('../../data');

describe('Auth suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';

	it('GET token', async function () {
		const {user1} = usersData.users;
		const {body, status} = await loginApi.login(user1);
		expect(status).to.eq(Statuses['200'], `User should get login with status 200`);
		expect(!!body.token).to.eq(true, `User should have token`);
		const token = body.token;
		{
			const {body, status} = await usersApi.getCurrentUser({token});
			expect(status).to.eq(Statuses['200'], `User should get user data with status 200`);
			expect(body.name).to.eq(user1.name, `Got user name "${body.name}" but name should be "${user1.name}"`);
		}
	});

	it('GET data without token', async function () {
	});

	it('POST data with token', async function () {
	});

	it('POST data without token', async function () {
		// 401 - unauthorized
	});

	it('POST data with invalid token', async function () {
		// 400 - bad data
	});

	it('DELETE data with non-admin user', async function () {
		// 403 - Forbidden
	});
});
