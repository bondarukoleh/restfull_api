const request = require('supertest');

let app = null;
const routes = require('../../routes/routes');

describe(routes.genres, () => {
	beforeAll(() => app = require('../../app'));
	afterAll(() => app.close());

	describe('GET /',() => {
		let req = null;
		beforeAll(() => req = request(app));

		it('should return all genres', async () => {
			const res = await req.get(routes.genres);
			expect(res.status).toEqual(200);
		});
	});
});
