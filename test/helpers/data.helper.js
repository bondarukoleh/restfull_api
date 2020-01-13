const faker = require('faker');

const getAnyUser = () => {
	return {
		name: `${faker.name.firstName()}_${faker.name.lastName()}`,
		password: faker.internet.password(),
		email: faker.internet.email(),
	};
};

module.exports = {getAnyUser};
