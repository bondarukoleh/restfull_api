const request = require('supertest');
const mongoose = require('mongoose');
const routes = require('../../../routes/routes');
const moment = require('moment');
const RentalModel = require('../../../db/modeles/rental.model').Model;
const UserModel = require('../../../db/modeles/user.model').Model;
const MovieModel = require('../../../db/modeles/movie.model').Model;

describe(routes.rental, () => {
	let app = null;
	let req = null;
	let rentalObj = null;
	let movieObj = null;

	beforeAll(() => {
		app = require('../../../app')(3004);
		req = request(app);
	});
	afterEach(async () => {
		await RentalModel.remove({_id: rentalObj._id});
		await MovieModel.remove({_id: movieObj._id});
	});
	afterAll(() => app.close());

	describe('POST /return', () => {
		const payload = {customerId: null, movieId: null};

		async function postRentalReturn() {
			const token = new UserModel().generateToken();
			return req.post(`${routes.rental}/return`).set('x-auth-token', token).send(payload)
		}

		beforeEach(async () => {
			payload.customerId = mongoose.Types.ObjectId();
			payload.movieId = mongoose.Types.ObjectId();

			movieObj = new MovieModel({
				title: 'Test Movie',
				dailyRentalRate: 2,
				numberInStock: 1,
				_id: payload.movieId,
				genre: {name: 'Test Genre'},
			});
			await movieObj.save();

			rentalObj = new RentalModel({
				customer: {
					name: 'Test Customer',
					phone: '+380981111111',
					_id: payload.customerId
				},
				movie: {
					title: 'Test Movie',
					dailyRentalRate: 2,
					_id: payload.movieId
				},
				dateOut: moment().add(-7, 'days').toDate(),
				dateReturned: null,
				rentFee: 0,
			});
			await rentalObj.save();
		});

		it('should return 400 with customerId is not provided', async () => {
		 	delete payload.customerId;
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is required`)
		});

		it('should return 400 with movieId is not provided', async () => {
			delete payload.movieId;
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is required`)
		});

		it('should return 404 if no rental found for customerId', async () => {
			await RentalModel.remove({_id: rentalObj._id});
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(404);
			expect(body.error).toContain(`No rental for customer with id`);
		});

		it('should return 400 if rental is already processed', async () => {
			rentalObj.dateReturned = new Date();
			await rentalObj.save();

			const {status, body} = await postRentalReturn();
			expect(status).toEqual(400);
			expect(body.error).toContain(`is already processed`);
		});

		it('should return 200 if valid request', async () => {
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(200);
			expect(body).toHaveProperty('_id', rentalObj._id.toHexString());
		});

		it('should set return date if valid request', async () => {
			const {status} = await postRentalReturn();
			expect(status).toEqual(200);

			const createdRental = await RentalModel.findById(rentalObj._id);
			expect(createdRental).toBeDefined();

			const returnDifference = new Date() - createdRental.dateReturned;
			expect(returnDifference).toBeLessThan(10 * 1000);
		});

		it('should calculate rental fee if valid request', async () => {
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(200);
			expect(body.rentFee).toEqual(14);
		});

		it('should increases the movie in stock', async () => {
			const {status} = await postRentalReturn();
			expect(status).toEqual(200);

			const returnedMovie = await MovieModel.findById(movieObj._id);
			let numberInStockBeforeReturn = movieObj.numberInStock;
			expect(returnedMovie.numberInStock).toEqual(++numberInStockBeforeReturn);
		});

		it('should return the rental', async () => {
			const expectedPropsArr = ['customer',	'movie', 'dateOut', 'dateReturned', 'rentFee']
			const {status, body} = await postRentalReturn();
			expect(status).toEqual(200);

			expect(Object.keys(body)).toEqual(expect.arrayContaining(expectedPropsArr))
		});
	});
});
