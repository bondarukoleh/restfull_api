const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {fixtures, schemes}} = require('../../test/data');

before(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	const {GenreModel, CustomersModel} = getModels(client);
	try {
		log.info(`Trying to create data`);
		const result1 = await GenreModel.insertMany(fixtures.genres);
		const result2 = await CustomersModel.insertMany(fixtures.customers);
		log.info(`Data created:`);
		log.info(result1, result2);
	}
	catch(e){
		if(e.message.includes('duplicate key error collection')){
			const result1 = await GenreModel.updateMany(fixtures.genres);
			const result2 = await CustomersModel.updateMany(fixtures.customers);
			log.info(`Data updated:`);
			return log.info(result1, result2)
		}
		log.error(`Couldn't create test data`);
		log.error(e)
	}
	finally {
		await client.disconnect();
	}
});

function getModels(mongoClient) {
	const genresSchema = new mongoClient.mongoose.Schema(schemes.genreScheme);
	const customersSchema = new mongoClient.mongoose.Schema(schemes.customerScheme);
	const GenreModel = mongoClient.mongoose.model('Genre', genresSchema);
	const CustomersModel = mongoClient.mongoose.model('Customer', customersSchema);
	return {GenreModel, CustomersModel}
}
