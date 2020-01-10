const {api: {loginApi, customersApi, genresApi, moviesApi, rentalsApi, usersApi}} = require('../../lib');
const {expect} = require('chai');
const {usersData} = require('../../data');

async function loginUser({email, password}) {
	const {body, status} = await loginApi.login({email, password});
	if(status !== 200 || !body.token) {
		throw new Error(`Couldn't get token for ${email}`)
	}
	return body.token;
}

async function postCustomer({name, phone, isGold}) {
	const token = await loginUser(usersData.users.admin);
	const {status, body} = await customersApi.postCustomer({name, phone, isGold, token});
	expect(status).to.eq(201, `postCustomer: Status should be 201`);
	expect(body.name).to.eq(name, `postCustomer: Created customer should be with name ${name}`);
	return body._id;
}

async function deleteCustomer(id) {
	const token = await loginUser(usersData.users.admin);
	const {status, body} = await customersApi.deleteCustomer({id, token});
	expect(status).to.eq(200, `deleteCustomer: Status should be 200`);
	expect(body._id).to.eq(id, `deleteCustomer: Should return deleted customer with id ${id}, got "${body.id}"`);
}
async function postGenre(genreName) {
	const {status, body} = await genresApi.postGenre({name: genreName});
	expect(status).to.eq(201, `postGenre: Status should be 201`);
	expect(body.name).to.eq(genreName, `postGenre: Created genre should be with name ${genreName}`);
	return body._id;
}

async function deleteGenre(id) {
	const {status, body} = await genresApi.deleteGenre({id});
	expect(status).to.eq(200, `deleteGenre: Status should be 204`);
	expect(body._id).to.eq(id, `deleteGenre: Should return deleted genre with id ${id}, got "${body.id}"`);
}

async function postMovie({title, genreId, numberInStock, dailyRentalRate}) {
	const {status, body} = await moviesApi.postMovie({title, genreId, numberInStock, dailyRentalRate});
	expect(status).to.eq(201, `postMovie: Status should be 201`);
	expect(body.title).to.eq(title, `postMovie: Created movie should be with title ${title}`);
	return body._id;
}

async function deleteMovie(id) {
	const {status, body} = await moviesApi.deleteMovie({id});
	expect(status).to.eq(200, `deleteMovie: Status should be 200`);
	expect(body._id).to.eq(id, `deleteMovie: Should return deleted movie with id ${id}, got "${body.id}"`);
}


async function postRental({movieId, customerId}) {
	const {status, body} = await rentalsApi.postRental({movieId, customerId});
	expect(status).to.eq(201, `postRental: Post rental status should be 201`);
	expect(body).to.include.keys(['customer', 'movie']);
	return body._id;
}

async function deleteRental(id) {
	const {status, body} = await rentalsApi.deleteRental({id});
	expect(status).to.eq(200, `deleteRental: Delete rental status should be 200`);
	expect(body._id).to.eq(id, `deleteRental: Should return deleted movie with id ${id}, got "${body.id}"`);
}

async function getCustomers() {
	const {status, body} = await customersApi.getCustomers();
	expect(status).to.eq(200, `getCustomers: Get customers status should be 200`);
	expect(!!body.length).to.eq(true, `getCustomers: Customers array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

async function getMovies() {
	const {status, body} = await moviesApi.getMovies();
	expect(status).to.eq(200, `getMovies: Get movies status should be 200`);
	expect(!!body.length).to.eq(true, `getMovies: Movies array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

async function postUser({email, name, password}) {
	const token = await loginUser(admin);
	const {status, body, headers} = await usersApi.createUser(token, {email, name, password});
	expect(status).to.eq(201, `postUser: Status should be 201`);
	expect(body.name).to.eq(name, `postUser: Created user should be with name ${name}`);
	return {userId: body._id, token: headers['x-auth-token']};
}

async function deleteUser(userToDeleteId) {
	const adminToken = await loginUser(admin);
	const {status, body} = await usersApi.deleteUser(adminToken, {id: userToDeleteId});
	expect(status).to.eq(200, `deleteUser: Status should be 200`);
	expect(body._id).to.eq(userToDeleteId, `deleteUser: Should return deleted user with id ${userToDeleteId}, got "${body.id}"`);
}

module.exports = {
	loginUser,
	postCustomer,
	deleteCustomer,
	deleteGenre,
	postMovie,
	deleteMovie,
	postRental,
	deleteRental,
	getCustomers,
	getMovies,
	postUser,
	deleteUser,
	postGenre,
};
