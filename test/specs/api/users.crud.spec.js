const {expect} = require('chai');
const {api: {usersApi}} = require('../../lib');
const {api: {common: {postUser, deleteUser, loginUser}}, dataHelper: {getAnyUser}} = require('../../helpers/');
const {usersData: {users: {admin}}} = require('../../data');

describe('Basic Users CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';
	let adminUser = null;

	before(async () => adminUser = await loginUser(admin));

	describe('GET Users', function () {
		it('GET Users array', async function () {
			const {status, body} = await usersApi.getUsers(adminUser);
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Users array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET user by id', async function () {
			const user = getAnyUser();
			const {userId, token} = await postUser(adminUser, user);
			const {status, body} = await usersApi.getCurrentUser({token});
			expect(status).to.eq(200, `Status should be 200`);
			expect(body.name).to.eq(user.name, `User with id "${userId}" name should be "${user.name}"`);
			await deleteUser(adminUser, userId);
		});
	});

	describe('POST Users', function () {
		it('POST Users', async function () {
			const user = getAnyUser();
			const {userId} = await postUser(adminUser, user);
			await deleteUser(adminUser, userId);
		});

		it('POST Users name less that 3 characters', async function () {
			const errorMessage = `"name" length must be at least 5 characters long`;
			const user = {...getAnyUser(), name: 'aa'};

			const {status, body} = await usersApi.postUser(adminUser, user);
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});

		it('POST Users without name', async function () {
			const errorMessage = `"name" is required`;
			const user = {...getAnyUser(), name: undefined};

			const {status, body} = await usersApi.postUser(adminUser, user);
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});

	describe('PUT Users', function () {
		let anyUser = null;
		beforeEach(() => anyUser = getAnyUser());

		it('PUT Users', async function () {
			const newName = 'New User Name';
			const {userId, token: createdUserToken} = await postUser(adminUser, anyUser);
			{
				const {status} = await usersApi.putUser(adminUser, {...anyUser, id: userId, name: newName});
				expect(status).to.eq(204, `Status should be 204`);
			}
			{
				const {status, body} = await usersApi.getCurrentUser({token: createdUserToken});
				expect(status).to.eq(200, `Status should be 204`);
				expect(body.name).to.eq(newName, `Changed user name should be '${newName}', got '${body.name}'`);
			}
			await deleteUser(adminUser, userId);
		});

		it('PUT Users with invalid id and data', async function () {
			const errorMessage = '"name" is not allowed to be empty';
			const {userId} = await postUser(adminUser, anyUser);
			{
				const {status, body} = await usersApi.putUser(adminUser, {...anyUser, id: invalidID});
				expect(status).to.eq(404, `Status should be 404`);
				expect(body.error).to.include('is not found', `User with invalid id shouldn't be found`);
			}
			{
				const {status, body} = await usersApi.putUser(adminUser, {...anyUser, id: userId, name: ''});
				expect(status).to.eq(400, `Status should be 400`);
				expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
			}
			await deleteUser(adminUser, userId);
		});
	});

	describe('DELETE Users', function () {
		let anyUser = null;
		beforeEach(() => anyUser = getAnyUser());

		it('DELETE User', async function () {
			const {userId} = await postUser(adminUser, anyUser);
			await deleteUser(adminUser, userId);
			const {status, body} = await usersApi.getUsers(adminUser);

			expect(status).to.eq(200, `Status should be 200`);
			const deletedPresent = body.some(user => user.id === userId);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${userId} shouldn't be present in array`);
		});

		it('DELETE Users with not existing id', async function () {
			const {userId} = await postUser(adminUser, anyUser);
			const {status, body} = await usersApi.deleteUser(adminUser, {id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('is not found', `User with invalid id shouldn't be found`);
			await deleteUser(adminUser, userId);
		});
	});
});
