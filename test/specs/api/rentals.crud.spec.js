const {expect} = require('chai');
const {api: {moviesApi, customersApi, rentalsApi}} = require('../../lib');
const {apiData: {Statuses}} = require('../../data');

async function postRental({movieId, customerId}) {
	const {status, body} = await rentalsApi.postRental({movieId, customerId});
	expect(status).to.eq(201, `Post rental status should be ${Statuses['201']}`);
	expect(body).to.include.keys(['customer', 'movie']);
	return body._id;
}

async function deleteRental(id) {
	const {status, body} = await rentalsApi.deleteRental({id});
	expect(status).to.eq(200, `Delete rental status should be 200`);
	expect(body._id).to.eq(id, `Should return deleted movie with id ${id}, got "${body.id}"`);
}

async function getCustomers() {
	const {status, body} = await customersApi.getCustomers();
	expect(status).to.eq(200, `Get customers status should be 200`);
	expect(!!body.length).to.eq(true, `Customers array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

async function getMovies() {
	const {status, body} = await moviesApi.getMovies();
	expect(status).to.eq(200, `Get movies status should be 200`);
	expect(!!body.length).to.eq(true, `Movies array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

describe('Basic Rentals CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';
	let rentalObj = null;
	before(async () => {
		rentalObj = {
			customerId: (await getCustomers())[0]._id,
			movieId: (await getMovies())[0]._id,
		};
	});

	describe('GET Rentals', function () {
		it('GET Rentals array', async function () {
			const {status, body} = await rentalsApi.getRentals();
			expect(status).to.eq(200, `Get rentals status should be ${Statuses['200']}`);
			expect(!!body.length).to.eq(true, `Rentals array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET rental by id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(rental);
			const {status, body} = await rentalsApi.getRental({id: rentalId});
			expect(status).to.eq(200, `Get rental status should be ${Statuses['200']}`);
			expect(body).to.include.keys(['customer', 'movie']);
			await deleteRental(rentalId);
		});

		it('GET rental with not existing id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(rental);

			const {status, body} = await rentalsApi.getRental({id: invalidID});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('not found', `Rental with invalid id shouldn't be found`);
			await deleteRental(rentalId);
		});
	});

	describe('POST Rentals', function () {
		it('POST rental', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(rental);
			await deleteRental(rentalId);
		});

		it('POST rental with not existing customer', async function () {
			const errorMessage = `not found`;
			const rental = {...rentalObj};
			rental.customerId = invalidID;
			const {status, body} = await rentalsApi.postRental(rental);
			expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});
	});

	describe('DELETE Rentals', function () {
		it('DELETE rental', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(rental);
			await deleteRental(rentalId);
			const {status, body} = await rentalsApi.getRentals();

			expect(status).to.eq(200, `Status should be 200`);
			const deletedPresent = body.some(rental => rental.id === rentalId);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${rentalId} shouldn't be present in array`);
		});

		it('DELETE rental with not existing id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(rental);
			const {status, body} = await rentalsApi.deleteRental({id: invalidID});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('is not found', `Rental with invalid id shouldn't be found`);
			await deleteRental(rentalId);
		});
	});
});
