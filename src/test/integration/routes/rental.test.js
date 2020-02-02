const request = require('supertest');
const mongoose = require('mongoose');
const routes = require('../../../routes/routes');
const faker = require('faker');
const RentalModel = require('../../../db/modeles/rental.model').Model;
const UserModel = require('../../../db/modeles/user.model').Model;

describe(routes.rental, () => {
	let app = null;
	let req = null;
	let rentalObj = null;

	beforeAll(() => {
		app = require('../../../app')(3004);
		req = request(app);
	});

	afterEach(async () => RentalModel.remove(rentalObj));
	afterAll(() => app.close());

	describe('POST /return', () => {
		let customerId = null;
		let movieId = null;

		async function postRentalReturn() {
			const token = new UserModel().generateToken();
			return req.post(`${routes.rental}/return`).set('x-auth-token', token).send(rentalObj)
		}

		beforeEach(async () => {
			customerId = mongoose.Types.ObjectId();
			movieId = mongoose.Types.ObjectId();

			rentalObj = new RentalModel({
				customer: {
					name: 'Test Customer',
					phone: '+380981111111',
					_id: customerId
				},
				movie: {
					title: 'Test Movie',
					dailyRentalRate: 1,
					_id: movieId
				},
				dateOut: faker.date.past(),
				dateReturned: faker.date.future(),
				rentFee: 2,
			});
		});

		it('should return 400 with customerId is not provided', async () => {
		 	customerId = null;
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is required`)
		});

		it('should return 400 with movieId is not provided', async () => {
			movieId = null;
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is required`)
		});

		it('should return 404 if no rental found for customerId', async () => {
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is required`)
		});

		// it('should return 400 if rental is already processed', async () => {});
		//
		// it('should return 200 if valid request', async () => {});
		//
		// it('should set return date if valid request', async () => {});
		//
		// it('should calculate rental fee if valid request', async () => {});
		//
		// it('should increases the movie in stock', async () => {});
		//
		// it('should return the rental', async () => {});
	});
});
