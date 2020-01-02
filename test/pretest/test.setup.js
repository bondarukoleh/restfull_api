const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {fixtures, schemes}} = require('../../test/data');

/* TODO: refactor this piece of crap. Make data creation more extendable and flexible */

// before(async function () {
(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	const {GenreModel, CustomersModel, MovieModel, RentalModel} = getModels(client);
	try {
		log.info(`Trying to create data`);
		const result1 = await GenreModel.insertMany(fixtures.genres);
		const result2 = await CustomersModel.insertMany(fixtures.customers);
		const result3 = await MovieModel.insertMany(fixtures.movies);
		const result4 = await RentalModel.insertMany(fixtures.rentals);
		log.info(`Data created`);
	}
	catch(e){
		if(e.message.includes('duplicate key error')){
			const result1 = await GenreModel.updateMany(fixtures.genres);
			const result2 = await CustomersModel.updateMany(fixtures.customers);
			const result3 = await MovieModel.updateMany(fixtures.movies);
			const result4 = await RentalModel.updateMany(fixtures.rentals);
			// TODO: we need to rewrite update data to something like this
			await MovieModel.updateMany({"_id": "5b77fdc3215eda645bc6bdec"}, {$set: {numberInStock: 10}});
			log.info(`Data updated`);
		}
		log.error(`Couldn't create test data`);
		log.error(e)
	}
	finally {
		await client.disconnect();
	}
})();

function getModels(mongoClient) {
	const GenreModel = mongoClient.mongoose.model('Genre', schemes.genreScheme);
	const CustomersModel = mongoClient.mongoose.model('Customer', schemes.customerScheme);
	const MovieModel = mongoClient.mongoose.model('Movie', schemes.movieScheme);
	const RentalModel = mongoClient.mongoose.model('Rental', schemes.rentalScheme);
	return {GenreModel, CustomersModel, MovieModel, RentalModel}
}
