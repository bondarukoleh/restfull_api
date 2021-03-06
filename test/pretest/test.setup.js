const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {fixtures, schemes}} = require('../../test/data');

/* TODO: refactor this piece of crap. Make it more readable */
let createError = null;

before(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	const {GenreModel, CustomersModel, MovieModel, RentalModel, UserModel} = getModels(client);
	const dataToCreation = [
		{model: GenreModel, data: fixtures.genres},
		{model: CustomersModel, data: fixtures.customers},
		{model: MovieModel, data: fixtures.movies},
		{model: RentalModel, data: fixtures.rentals},
		{model: UserModel, data: fixtures.users},
	];
	for (const {model, data} of dataToCreation) {
		await createOrUpdate(model, data)
	}
	log.info(`Attempt to create a data pass with error ${createError}. After that - we've tried to update it.`);
	await client.disconnect();
});

function getModels(mongoClient) {
	const GenreModel = mongoClient.mongoose.model('Genre', schemes.genreScheme);
	const CustomersModel = mongoClient.mongoose.model('Customer', schemes.customerScheme);
	const MovieModel = mongoClient.mongoose.model('Movie', schemes.movieScheme);
	const RentalModel = mongoClient.mongoose.model('Rental', schemes.rentalScheme);
	const UserModel = mongoClient.mongoose.model('User', schemes.userScheme);
	return {GenreModel, CustomersModel, MovieModel, RentalModel, UserModel}
}

async function insertData(model, dataToInsert) {
	let withoutError = true;
	dataToInsert = Array.isArray(dataToInsert) ? dataToInsert : [dataToInsert];
	for (const data of dataToInsert) {
		try {
			await model.insertMany(data);
		} catch (e) {
			createError = e.message;
			withoutError = false;
		}
	}
	return withoutError;
}

async function updateData(model, dataToUpdate) {
	for(const {_id, ...rest} of dataToUpdate){
		await model.updateMany({_id}, {$set: rest});
	}
}

async function createOrUpdate(model, data){
	const insertionWithoutErrors = await insertData(model, data);
	if(!insertionWithoutErrors) {
		await updateData(model, data);
	}
}
