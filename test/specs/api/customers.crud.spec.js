const {expect} = require('chai');
const {api: {customersApi}} = require('../../lib');
const {common: {deleteCustomer, postCustomer, loginUser}} = require('../../helpers/api');
const {usersData} = require('../../data');

describe('Basic Customers CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';

	describe('GET Customers', function () {
		it('GET Customers array', async function () {
			const {status, body} = await customersApi.getCustomers();
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Customers array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET customer by id', async function () {
			const customer = {name: 'Customer to check', phone: '+380981111111'};
			const customerId = await postCustomer(customer);
			const {status, body} = await customersApi.getCustomer({id: customerId});
			expect(status).to.eq(200, `Status should be 200`);
			expect(body.name).to.eq(customer.name, `Customer with id "${customerId}" name should be "${customer.name}"`);
			await deleteCustomer(customerId);
		});

		it('GET customer with not existing id', async function () {
			const customer = {name: 'Customer to check', phone: '+380981111111'};
			const customerId = await postCustomer(customer);
			const {status, body} = await customersApi.getCustomer({id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('not found', `Customer with invalid id shouldn't be found`);
			await deleteCustomer(customerId);
		});
	});

	describe('POST Customers', function () {
		it('POST Customers', async function () {
			const customer = {name: 'Customer to check', phone: '+380981111111'};
			const customerId = await postCustomer(customer);
			await deleteCustomer(customerId);
		});

		it('POST Customers name less that 3 characters', async function () {
			const errorMessage = `"name" length must be at least 5 characters long`;
			const customer = {name: 'aa', phone: '+380981111111'};
			const token = await loginUser(usersData.users.admin);
			const {status, body} = await customersApi.postCustomer({...customer, token});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});

		it('POST Customers without name', async function () {
			const errorMessage = `"name" is required`;
			const customer = {name: undefined, phone: '+380981111111'};

			const token = await loginUser(usersData.users.admin);
			const {status, body} = await customersApi.postCustomer({...customer, token});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});

	describe('PUT Customers', function () {
		it('PUT Customers', async function () {
			const creationName = 'Some Customer Name';
			const newName = 'New Customer Name';
			const phone = '+380981111111';
			const customerId = await postCustomer({name: creationName, phone});
			{
				const {status} = await customersApi.putCustomer({id: customerId, name: newName, phone});
				expect(status).to.eq(204, `Status should be 204`);
			}
			{
				const {status, body} = await customersApi.getCustomer({id: customerId});
				expect(status).to.eq(200, `Status should be 204`);
				expect(body.name).to.eq(newName, `Changed customer name should be '${newName}', got '${body.name}'`);
			}
			await deleteCustomer(customerId);
		});

		it('PUT Customers with invalid id and data', async function () {
			const creationName = 'Customer Name';
			const errorMessage = '"name" is not allowed to be empty';
			const phone = '+380981111111';
			const customerId = await postCustomer({name: creationName, phone});
			{
				const {status, body} = await customersApi.putCustomer({id: invalidID, name: 'new name', phone});
				expect(status).to.eq(404, `Status should be 404`);
				expect(body.error).to.include('is not found', `Customer with invalid id shouldn't be found`);
			}
			{
				const {status, body} = await customersApi.putCustomer({id: customerId, name: '', phone});
				expect(status).to.eq(400, `Status should be 400`);
				expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
			}
			await deleteCustomer(customerId);
		});
	});

	describe('DELETE Customers', function () {
		it('DELETE Customers', async function () {
			const customer = {name: 'Customer to delete', phone: '+380981111111'};
			const customerId = await postCustomer(customer);
			await deleteCustomer(customerId);
			const {status, body} = await customersApi.getCustomers();

			expect(status).to.eq(200, `Status should be 200`);
			const deletedPresent = body.some(customer => customer.id === customerId);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${customerId} shouldn't be present in array`);
		});

		it('DELETE Customers with not existing id', async function () {
			const customer = {name: 'Customer to delete', phone: '+380981111111'};
			const customerId = await postCustomer(customer);
			const {status, body} = await customersApi.deleteCustomer({id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('is not found', `Customer with invalid id shouldn't be found`);
			await deleteCustomer(customerId);
		});
	});
});
