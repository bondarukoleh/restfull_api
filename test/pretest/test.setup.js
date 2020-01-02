const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {fixtures, schemes}} = require('../../test/data');

/* TODO: refactor this piece of crap. Make it more readable */

// before(async function () {
(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	const {GenreModel, CustomersModel, MovieModel, RentalModel} = getModels(client);
	const dataToCreation = [
		{model: GenreModel, data: fixtures.genres},
		{model: CustomersModel, data: fixtures.customers},
		{model: MovieModel, data: fixtures.movies},
		{model: RentalModel, data: fixtures.rentals}
	];
	await createTestData(dataToCreation);
	await client.disconnect();
})();

async function createTestData(dataCreationArray) {
	log.info(`Trying to create data...`);
	for (const {model, data} of dataCreationArray) {
		await createOrUpdate(model, data)
	}
}

function getModels(mongoClient) {
	const GenreModel = mongoClient.mongoose.model('Genre', schemes.genreScheme);
	const CustomersModel = mongoClient.mongoose.model('Customer', schemes.customerScheme);
	const MovieModel = mongoClient.mongoose.model('Movie', schemes.movieScheme);
	const RentalModel = mongoClient.mongoose.model('Rental', schemes.rentalScheme);
	return {GenreModel, CustomersModel, MovieModel, RentalModel}
}

async function insertData(model, dataToInsert) {
	return model.insertMany(dataToInsert);
}

async function updateData(model, dataToUpdate) {
	for(const {_id, ...rest} of dataToUpdate){
		const result = await model.updateMany({_id}, {$set: rest});
		log.info(`Data updated:`, result);
	}
}

async function createOrUpdate(model, data){
	try {
		const result = await insertData(model, data);
		log.info(`Data created:`, result);
	} catch (e) {
		log.error(`Couldn't create test data for`, model);
		if(e.message.includes('duplicate key error')){
			await updateData(model, data);
		} else {
			log.error(`Couldn't create test data.`);
			log.error(e)
		}
	}
}
