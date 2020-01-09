const {api: {loginApi, customersApi, genresApi, moviesApi, rentalsApi, usersApi}} = require('../../lib');

async function loginUser({email, password}) {
	const {body, status} = await loginApi.login({email, password});
	if(status !== 200 || !body.token) {
		throw new Error(`Couldn't get token for ${email}`)
	}
	return body.token;
}

async function postCustomer({name, phone}) {
	const {status, body} = await customersApi.postCustomer({name, phone});
	expect(status).to.eq(201, `Status should be 201`);
	expect(body.name).to.eq(name, `Created customer should be with name ${name}`);
	return body._id;
}

async function deleteCustomer(id) {
	const {status, body} = await customersApi.deleteCustomer({id});
	expect(status).to.eq(200, `Status should be 200`);
	expect(body._id).to.eq(id, `Should return deleted customer with id ${id}, got "${body.id}"`);
}
async function postGenre(genreName) {
	const {status, body} = await genresApi.postGenre({name: genreName});
	expect(status).to.eq(201, `Status should be 201`);
	expect(body.name).to.eq(genreName, `Created genre should be with name ${genreName}`);
	return body._id;
}

async function deleteGenre(id) {
	const {status, body} = await genresApi.deleteGenre({id});
	expect(status).to.eq(200, `Status should be 204`);
	expect(body._id).to.eq(id, `Should return deleted genre with id ${id}, got "${body.id}"`);
}

async function postMovie({title, genreId, numberInStock, dailyRentalRate}) {
	const {status, body} = await moviesApi.postMovie({title, genreId, numberInStock, dailyRentalRate});
	expect(status).to.eq(201, `Status should be 201`);
	expect(body.title).to.eq(title, `Created movie should be with title ${title}`);
	return body._id;
}

async function deleteMovie(id) {
	const {status, body} = await moviesApi.deleteMovie({id});
	expect(status).to.eq(200, `Status should be 200`);
	expect(body._id).to.eq(id, `Should return deleted movie with id ${id}, got "${body.id}"`);
}


async function postRental({movieId, customerId}) {
	const {status, body} = await rentalsApi.postRental({movieId, customerId});
	expect(status).to.eq(201, `Post rental status should be 201`);
	expect(body).to.include.keys(['customer', 'movie']);
	return body._id;
}

async function deleteRental(id) {
	const {status, body} = await rentalsApi.deleteRental({id});
	expect(status).to.eq(200, `Delete rental status should be 200`);
	expect(body._id).to.eq(id, `Should return deleted movie with id ${id}, got "${body.id}"`);
}

async function getCustomers() {
	const {status, body} = await customersApi.getCustomers();
	expect(status).to.eq(200, `Get customers status should be 200`);
	expect(!!body.length).to.eq(true, `Customers array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

async function getMovies() {
	const {status, body} = await moviesApi.getMovies();
	expect(status).to.eq(200, `Get movies status should be 200`);
	expect(!!body.length).to.eq(true, `Movies array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

async function postUser({email, name, password}) {
	const token = await loginUser(admin);
	const {status, body, headers} = await usersApi.createUser(token, {email, name, password});
	expect(status).to.eq(201, `Status should be 201`);
	expect(body.name).to.eq(name, `Created user should be with name ${name}`);
	return {userId: body._id, token: headers['x-auth-token']};
}

async function deleteUser(userToDeleteId) {
	const adminToken = await loginUser(admin);
	const {status, body} = await usersApi.deleteUser(adminToken, {id: userToDeleteId});
	expect(status).to.eq(200, `Status should be 200`);
	expect(body._id).to.eq(userToDeleteId, `Should return deleted user with id ${userToDeleteId}, got "${body.id}"`);
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
