const request = require('supertest');
const mongoose = require('mongoose');
const routes = require('../../routes/routes');

describe(routes.genres, () => {
	let app = null;
	let req = null;
	let GenreModel = null;
	let removeQuery = null;

	beforeAll(() => {
		app = require('../../app');
		req = request(app);
		GenreModel = require('../../db/modeles/genre.model').Model;
	});
	afterAll(() => app.close());
	afterEach(async () => {
		if (removeQuery) {
			await GenreModel.remove(removeQuery);
		}
		removeQuery = null;
	});

	describe('GET /', () => {
		it('should return all genres', async () => {
			const genres = [{name: 'genre1'}, {name: 'genre2'}];
			removeQuery = {name: {$in: [genres[0].name, genres[1].name]}};

			await GenreModel.collection.insertMany(genres);
			const {status, body} = await req.get(routes.genres);
			expect(status).toEqual(200);
			expect(body.some(item => item.name === genres[0].name)).toEqual(true);
		});
	});

	describe('GET /:id', () => {
		it('should return genre by id', async () => {
			const genreObject = {name: 'genre1'};
			const genre = new GenreModel(genreObject);
			await genre.save();
			removeQuery = genreObject;

			const {status, body: {_id, name}} = await req.get(`${routes.genres}/${genre._id}`);
			expect(status).toEqual(200);
			expect(_id).toEqual(genre._id.toHexString());
			expect(name).toEqual(genre.name);
		});

		it('should return 404 with not existing id', async () => {
			const notExistingID = mongoose.Types.ObjectId();
			const {status, body} = await req.get(`${routes.genres}/${notExistingID}`);
			expect(status).toEqual(404);
			expect(body.error).toContain(`not found`);
		});
	});

	describe('POST /', () => {
		const admin = {
			"email": "johnDoeAdmin@gmail.com",
			"password": "123456",
		};

		it('should return 401 wih unauthorized user', async () => {
			const {status, body} = await req.post(routes.genres).send({name: 'test'});
			expect(status).toEqual(401);
			expect(body.error).toContain('Unauthorized');
		});

		it('should return 400 with invalid data', async () => {
			const loggedUser = await req.post(routes.auth).send(admin);
			const {status, body} = await req.post(`${routes.genres}`)
				.set('x-auth-token', loggedUser.body.token)
				.send({name: 'te'});
			expect(status).toEqual(400);
			expect(body.error).toContain(`least 3 characters long`);
		});
	});
});
