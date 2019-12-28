const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {fixtures, schemes}} = require('../../test/data');

// before(async function () {
(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	const {GenreModel, CustomersModel, MovieModel} = getModels(client);
	try {
		log.info(`Trying to create data`);
		const result1 = await GenreModel.insertMany(fixtures.genres);
		const result2 = await CustomersModel.insertMany(fixtures.customers);
		const result3 = await MovieModel.insertMany(fixtures.movies);
		log.info(`Data created:`);
		log.info(result1, result2, result3);
	}
	catch(e){
		console.log('CATCHING ERROR')
		if(e.message.includes('duplicate key error')){
			const result1 = await GenreModel.updateMany(fixtures.genres);
			const result2 = await CustomersModel.updateMany(fixtures.customers);
			const result3 = await MovieModel.updateMany(fixtures.movies);
			log.info(`Data updated:`);
			return log.info(result1, result2, result3)
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
	return {GenreModel, CustomersModel, MovieModel}
}
