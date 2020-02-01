const {isUser} = require('../../../middleware/authenticate.middleware');
const UserModel = require('../../../db/modeles/user.model').Model;
const mongoose = require('mongoose');

describe(`Authorization unit`, () => {
	it('should populate request object with decoded user from token', async () => {
		let nextCalled = false;
		const next = () => nextCalled = true;
		const userObj = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
		const token = new UserModel(userObj).generateToken();
		/* Could do so, but since we are using jest */
		// const req = {header() {return token;}};
		const req = {header: jest.fn().mockReturnValue(token)};

		isUser(req, {}, next);

		expect(req.user).not.toBeNull();
		expect(req.user).toMatchObject(userObj);
		expect(nextCalled).toEqual(true);
	});
});
