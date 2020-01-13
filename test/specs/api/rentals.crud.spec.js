const {expect} = require('chai');
const {api: {rentalsApi}} = require('../../lib');
const {common: {postRental, deleteRental, loginUser, getCustomers, getMovies}} = require('../../helpers/api');
const {usersData: {users: {admin}}} = require('../../data');

describe('Basic Rentals CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';
	let rentalObj = null;
	let adminUser = null;

	before(async () => {
		rentalObj = {
			customerId: (await getCustomers())[0]._id,
			movieId: (await getMovies())[0]._id,
		};
		adminUser = await loginUser(admin);
	});

	describe('GET Rentals', function () {
		it('GET Rentals array', async function () {
			const {status, body} = await rentalsApi.getRentals();
			expect(status).to.eq(200, `Get rentals status should be 200`);
			expect(!!body.length).to.eq(true, `Rentals array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET rental by id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(adminUser, rental);
			const {status, body} = await rentalsApi.getRental({id: rentalId});
			expect(status).to.eq(200, `Get rental status should be 200`);
			expect(body).to.include.keys(['customer', 'movie']);
			await deleteRental(adminUser, rentalId);
		});

		it('GET rental with not existing id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(adminUser, rental);

			const {status, body} = await rentalsApi.getRental({id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('not found', `Rental with invalid id shouldn't be found`);
			await deleteRental(adminUser, rentalId);
		});
	});

	describe('POST Rentals', function () {
		it('POST rental', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(adminUser, rental);
			await deleteRental(adminUser, rentalId);
		});

		it('POST rental with not existing customer', async function () {
			const errorMessage = `not found`;
			const rental = {...rentalObj};
			rental.customerId = invalidID;
			const {status, body} = await rentalsApi.postRental(adminUser, rental);
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});
	});

	describe('DELETE Rentals', function () {
		it('DELETE rental', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(adminUser, rental);
			await deleteRental(adminUser, rentalId);
			const {status, body} = await rentalsApi.getRentals();

			expect(status).to.eq(200, `Status should be 200`);
			const deletedPresent = body.some(rental => rental.id === rentalId);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${rentalId} shouldn't be present in array`);
		});

		it('DELETE rental with not existing id', async function () {
			const rental = {...rentalObj};
			const rentalId = await postRental(adminUser, rental);
			const {status, body} = await rentalsApi.deleteRental(adminUser, {id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('is not found', `Rental with invalid id shouldn't be found`);
			await deleteRental(adminUser, rentalId);
		});
	});
});
