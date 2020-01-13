const {api: {loginApi, customersApi, genresApi, moviesApi, rentalsApi, usersApi}} = require('../../lib');
const {expect} = require('chai');

async function loginUser({email, password}) {
	const {body, status} = await loginApi.login({email, password});
	if(status !== 200 || !body.token) {
		throw new Error(`Couldn't get token for ${email}`)
	}
	return {token: body.token, email, password};
}

async function postCustomer({token}, {name, phone, isGold}) {
	const {status, body} = await customersApi.postCustomer({token}, {name, phone, isGold});
	expect(status).to.eq(201, `postCustomer: Status should be 201`);
	expect(body.name).to.eq(name, `postCustomer: Created customer should be with name ${name}`);
	return body._id;
}

async function deleteCustomer({token}, id) {
	const {status, body} = await customersApi.deleteCustomer({token}, {id});
	expect(status).to.eq(200, `deleteCustomer: Status should be 200`);
	expect(body._id).to.eq(id, `deleteCustomer: Should return deleted customer with id ${id}, got "${body.id}"`);
}

async function postGenre({token}, genreName) {
	const {status, body} = await genresApi.postGenre({token}, {name: genreName});
	expect(status).to.eq(201, `postGenre: Status should be 201`);
	expect(body.name).to.eq(genreName, `postGenre: Created genre should be with name ${genreName}`);
	return body._id;
}

async function deleteGenre({token}, id) {
	const {status, body} = await genresApi.deleteGenre({token}, {id});
	expect(status).to.eq(200, `deleteGenre: Status should be 204`);
	expect(body._id).to.eq(id, `deleteGenre: Should return deleted genre with id ${id}, got "${body.id}"`);
}

async function postMovie({token}, {title, genreId, numberInStock, dailyRentalRate}) {
	const {status, body} = await moviesApi.postMovie({token}, {title, genreId, numberInStock, dailyRentalRate});
	expect(status).to.eq(201, `postMovie: Status should be 201`);
	expect(body.title).to.eq(title, `postMovie: Created movie should be with title ${title}`);
	return body._id;
}

async function deleteMovie({token}, id) {
	const {status, body} = await moviesApi.deleteMovie({token}, {id});
	expect(status).to.eq(200, `deleteMovie: Status should be 200`);
	expect(body._id).to.eq(id, `deleteMovie: Should return deleted movie with id ${id}, got "${body.id}"`);
}


async function postRental({token}, {movieId, customerId}) {
	const {status, body} = await rentalsApi.postRental({token}, {movieId, customerId});
	expect(status).to.eq(201, `postRental: Post rental status should be 201`);
	expect(body).to.include.keys(['customer', 'movie']);
	return body._id;
}

async function deleteRental({token}, id) {
	const {status, body} = await rentalsApi.deleteRental({token}, {id});
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

async function postUser({token}, {email, name, password}) {
	const {status, body, headers} = await usersApi.postUser({token}, {email, name, password});
	expect(status).to.eq(201, `postUser: Status should be 201`);
	expect(body.name).to.eq(name, `postUser: Created user should be with name ${name}`);
	return {userId: body._id, token: headers['x-auth-token']};
}

async function deleteUser({token}, userToDeleteId) {
	const {status, body} = await usersApi.deleteUser({token}, {id: userToDeleteId});
	expect(status).to.eq(200, `deleteUser: Status should be 200`);
	expect(body._id).to.eq(userToDeleteId, `deleteUser: Should return deleted user with id ${userToDeleteId}, got "${body.id}"`);
}

async function getGenres() {
	const {status, body} = await genresApi.getGenres();
	expect(status).to.eq(200, `Status should be 200`);
	expect(!!body.length).to.eq(true, `Genres array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
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
	getGenres,
};
