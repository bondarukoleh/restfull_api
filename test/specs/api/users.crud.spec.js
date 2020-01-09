const {expect} = require('chai');
const {api: {usersApi}} = require('../../lib');
const {api: {common: {loginUser}}} = require('../../helpers');
const {usersData} = require('../../data');
const {common: {postUser, deleteUser}} = require('../../helpers/api');

const {admin} = usersData.users;
const invalidToken = '1dffde1111e11e1fa1c111b1';

describe('Basic Customers CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';

	describe('GET Users', function () {
		it('GET Users array', async function () {
			const token = await loginUser(admin);
			const {status, body} = await usersApi.getUsers(token);
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Users array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET user by id', async function () {
			const user = {name: 'User to check', password: '1111111', email: 'john@gmail.com'};
			const {userId, token} = await postUser(user);
			const {status, body} = await usersApi.getCurrentUser(token);
			expect(status).to.eq(200, `Status should be 200`);
			expect(body.name).to.eq(user.name, `Customer with id "${userId}" name should be "${user.name}"`);
			await deleteUser(userId);
		});

		// it('GET user with not existing id', async function () {
		// 	const user = {name: 'Customer to check', phone: '+380981111111'};
		// 	const userId = await postUser(user);
		// 	const {status, body} = await usersApi.getCustomer({id: invalidID});
		// 	expect(status).to.eq(404, `Status should be 404`);
		// 	expect(body.error).to.include('not found', `Customer with invalid id shouldn't be found`);
		// 	await deleteUser(userId);
		// });
	});

	// describe('POST Users', function () {
	// 	it('POST Users', async function () {
	// 		const user = {name: 'Customer to check', phone: '+380981111111'};
	// 		const userId = await postUser(user);
	// 		await deleteUser(userId);
	// 	});
	//
	// 	it('POST Users name less that 3 characters', async function () {
	// 		const errorMessage = `"name" length must be at least 5 characters long`;
	// 		const user = {name: 'aa', phone: '+380981111111'};
	//
	// 		const {status, body} = await usersApi.postUser(user);
	// 		expect(status).to.eq(400, `Status should be 400`);
	// 		expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
	// 	});
	//
	// 	it('POST Users without name', async function () {
	// 		const errorMessage = `"name" is required`;
	// 		const user = {name: undefined, phone: '+380981111111'};
	//
	// 		const {status, body} = await usersApi.postUser(user);
	// 		expect(status).to.eq(400, `Status should be 400`);
	// 		expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
	// 	});
	// });
	//
	// describe('PUT Users', function () {
	// 	it('PUT Users', async function () {
	// 		const creationName = 'Some Customer Name';
	// 		const newName = 'New Customer Name';
	// 		const phone = '+380981111111';
	// 		const userId = await postUser({name: creationName, phone});
	// 		{
	// 			const {status} = await usersApi.putCustomer({id: userId, name: newName, phone});
	// 			expect(status).to.eq(204, `Status should be 204`);
	// 		}
	// 		{
	// 			const {status, body} = await usersApi.getCustomer({id: userId});
	// 			expect(status).to.eq(200, `Status should be 204`);
	// 			expect(body.name).to.eq(newName, `Changed user name should be '${newName}', got '${body.name}'`);
	// 		}
	// 		await deleteUser(userId);
	// 	});
	//
	// 	it('PUT Users with invalid id and data', async function () {
	// 		const creationName = 'Customer Name';
	// 		const errorMessage = '"name" is not allowed to be empty';
	// 		const phone = '+380981111111';
	// 		const userId = await postUser({name: creationName, phone});
	// 		{
	// 			const {status, body} = await usersApi.putCustomer({id: invalidID, name: 'new name', phone});
	// 			expect(status).to.eq(404, `Status should be 404`);
	// 			expect(body.error).to.include('is not found', `Customer with invalid id shouldn't be found`);
	// 		}
	// 		{
	// 			const {status, body} = await usersApi.putCustomer({id: userId, name: '', phone});
	// 			expect(status).to.eq(400, `Status should be 400`);
	// 			expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
	// 		}
	// 		await deleteUser(userId);
	// 	});
	// });
	//
	// describe('DELETE Users', function () {
	// 	it('DELETE Users', async function () {
	// 		const user = {name: 'Customer to delete', phone: '+380981111111'};
	// 		const userId = await postUser(user);
	// 		await deleteUser(userId);
	// 		const {status, body} = await usersApi.getUsers();
	//
	// 		expect(status).to.eq(200, `Status should be 200`);
	// 		const deletedPresent = body.some(user => user.id === userId);
	// 		expect(deletedPresent).to.eq(false, `Deleted item with id ${userId} shouldn't be present in array`);
	// 	});
	//
	// 	it('DELETE Users with not existing id', async function () {
	// 		const user = {name: 'Customer to delete', phone: '+380981111111'};
	// 		const userId = await postUser(user);
	// 		const {status, body} = await usersApi.deleteUser({id: invalidID});
	// 		expect(status).to.eq(404, `Status should be 404`);
	// 		expect(body.error).to.include('is not found', `Customer with invalid id shouldn't be found`);
	// 		await deleteUser(userId);
	// 	});
	// });
});
