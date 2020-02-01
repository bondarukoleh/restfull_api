const jwt = require('jsonwebtoken');
const {jwt_ppk} = require('config');
const mongoose = require('mongoose');
const {Model: UserModel} = require('../../../db/modeles/user.model');

describe('Unit tests', () => {
	describe('', () => {
		it('should generate a valid token', () => {
			/* toHexString - because it will return ObjectId object. But jwt.verify will return a string */
			const userObj = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
			const token = new UserModel(userObj).generateToken();
			const decodedUser = jwt.verify(token, jwt_ppk);
			expect(decodedUser).toMatchObject(userObj);
		});
	});
});

