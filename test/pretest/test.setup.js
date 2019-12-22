const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});
const {dbData: {genreFixtures, schemes}} = require('../../test/data');
let GenreModel = null;

before(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	GenreModel = getGenreModel(client);
	try {
		log.info(`Trying to create data`);
		const result = await GenreModel.insertMany(genreFixtures);
		log.info(`Data created:`);
		log.info(result);
	}
	catch(e){
		if(e.message.includes('duplicate key error collection')){
			const result = await GenreModel.updateMany(genreFixtures);
			log.info(`Data updated:`);
			return log.info(result)
		}
		log.error(`Couldn't create test data`);
		for(const field in e.errors){
			log.error(e.errors.field)
		}
	}
	finally {
		await client.disconnect();
	}
});

function getGenreModel(mongoClient) {
	const genresSchema = new mongoClient.mongoose.Schema(schemes.genreScheme);
	return mongoClient.mongoose.model('Genre', genresSchema);
}

async function updateCourse(courseID, updateObject) {
	const course = await GenreModel.findById(courseID);
	if (!course) {
		return 'No such course';
	}
	course.set(updateObject);
	return course.save();
}
