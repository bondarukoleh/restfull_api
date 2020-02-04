const request = require('supertest');
const mongoose = require('mongoose');
const routes = require('../../../routes/routes');

let app = null;
let req = null;
const GenreModel = require('../../../db/modeles/genre.model').Model;
const UserModel = require('../../../db/modeles/user.model').Model;

async function postGenre({name, withAuth = true}) {
	const token = withAuth ? new UserModel().generateToken() : '';
	return req.post(`${routes.genres}`).set('x-auth-token', token).send({name})
}

describe(routes.genres, () => {
	let removeQuery = null;

	beforeAll(() => {
		// reason why in the before all - if failed - we can see faster what's goes wrong
		// TODO: rewrite without hardcoded port, won't work on prod
		app = require('../../../app')(3002);
		req = request(app);
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
		it('should return 400 with name less than 3 characters data', async () => {
			const {status, body} = await postGenre({name: 'test'});
			expect(status).toEqual(400);
			expect(body.error).toContain(`least 5 characters long`);
		});

		it('should return 400 with name more than 20 characters data', async () => {
			const {status, body} = await postGenre({name: new Array(21).fill('t').join('')});
			expect(status).toEqual(400);
			expect(body.error).toContain(`length must be less than or equal to`);
		});

		it('should add data to DB', async () => {
			const genreObj = {name: `test genre ${Math.ceil(Math.random() * 1000)}`};
			removeQuery = genreObj;

			const {status} = await postGenre(genreObj);
			expect(status).toEqual(201);

			const genre = await GenreModel.findOne(genreObj);
			expect(genre).toMatchObject(genreObj);
		});

		it('should return genre objects', async () => {
			const genreObj = {name: `test genre ${Math.ceil(Math.random() * 1000)}`};
			removeQuery = genreObj;

			const {status, body} = await postGenre(genreObj);
			expect(status).toEqual(201);
			expect(body).toMatchObject(genreObj);
		});
	});
});
