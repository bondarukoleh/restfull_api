const {expect} = require('chai');
const {api: {loginApi, usersApi}} = require('../../lib');
const {usersData} = require('../../data');

describe('Auth suite', function () {

	const {user1} = usersData.users;
	const invalidToken = '1dffde1111e11e1fa1c111b1';

	it('GET token', async function () {
		const {body, status} = await loginApi.login(user1);
		expect(status).to.eq(200, `User should get login with status 200`);
		expect(!!body.token).to.eq(true, `User should have token`);
	});

	it('GET data with token', async function () {
		const {body, status} = await loginApi.login(user1);
		expect(status).to.eq(200, `User should get login with status 200`);
		expect(!!body.token).to.eq(true, `User should have token`);
		const token = body.token;
		{
			const {body, status} = await usersApi.getCurrentUser(token);
			expect(status).to.eq(200, `User should get user data with status 200`);
			expect(body.name).to.eq(user1.name, `Got user name "${body.name}" but name should be "${user1.name}"`);
		}
	});

	it('GET data without token', async function () {
		const errorMessage = 'Unauthorized. No token.';

		const {body, status} = await usersApi.getCurrentUser();
		expect(status).to.eq(401, `User get 401 without token`);
		expect(body.error).to.eq(errorMessage);
	});

	it('GET data with invalid token', async function () {
		const errorMessage = 'Invalid token.';

		const {body, status} = await usersApi.getCurrentUser(invalidToken);
		expect(status).to.eq(400, `User get 400 with invalid token`);
		expect(body.error).to.eq(errorMessage);
	});

	it('DELETE data with non-admin user', async function () {
		const errorMessage = 'Forbidden. You have no rights to perform this operation.';

		const {body, status} = await loginApi.login(user1);
		expect(status).to.eq(200, `User should get login with status 200`);
		expect(!!body.token).to.eq(true, `User should have token`);
		const token = body.token;
		{
			const {body, status} = await usersApi.deleteUser(token);
			expect(status).to.eq(403, `Not admin User should get 403`);
			expect(body.error).to.eq(errorMessage);
		}
	});
});
