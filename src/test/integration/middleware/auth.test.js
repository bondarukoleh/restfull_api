const request = require('supertest');
const routes = require('../../../routes/routes');
const UserModel = require('../../../db/modeles/user.model').Model;

describe(`Authorization`, () => {
	let token = null;
	let name = null;
	let app = null;
	let req = null;

	async function postGenre() {
		return req.post(`${routes.genres}`).set('x-auth-token', token).send({name})
	}

	beforeAll(() => {
		// TODO: rewrite without hardcoded port
		app = require('../../../app')(3003);
		req = request(app);
	});
	beforeEach(() => {
		token = new UserModel().generateToken();
		name = 'test auth via genre';
	});
	afterAll(() => app.close());

	it('should return 401 wih unauthorized user', async () => {
		token = '';

		const {status, body} = await postGenre();
		expect(status).toEqual(401);
		expect(body.error).toContain('Unauthorized');
	});

	it('should return 400 with invalid token', async () => {
		token = null; // invalid token
		const {status, body} = await postGenre();
		expect(status).toEqual(400);
		expect(body.error).toContain('Invalid token');
	});

	it('should return 201 with valid token', async () => {
		const {status} = await postGenre();
		expect(status).toEqual(201);
	});
});
