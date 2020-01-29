const request = require('supertest');
const mongoose = require('mongoose');
const routes = require('../../routes/routes');

describe(routes.genres, () => {
	let app = null;
	let req = null;
	let GenreModel = null;

	beforeAll( () => {
		app = require('../../app');
		req = request(app);
		GenreModel = require('../../db/modeles/genre.model').Model;
	});
	afterAll(() => app.close());
	let removeQuery = null;
	afterEach(async () => {
		if(removeQuery) {
			await GenreModel.remove(removeQuery)
		}
		removeQuery = null;
	});

	describe('GET /',() => {
		it('should return all genres', async () => {
			const genres = [{name: 'genre1'}, {name: 'genre2'}];
			removeQuery = {name: {$in: [genres[0].name, genres[1].name]}};

			await GenreModel.collection.insertMany(genres);
			const {status, body} = await req.get(routes.genres);
			expect(status).toEqual(200);
			expect(body.some(item => item.name === genres[0].name)).toEqual(true);
		});
	});

	describe('GET :id',() => {
		let removeQuery = null;
		afterEach(async () => GenreModel.remove(removeQuery));

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
});
