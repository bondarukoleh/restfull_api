const {client} = require('../helpers/db');
const log = require('../helpers/logger')({name: 'Pretest'});

before(async function () {
	log.info(`Creating data for testing.`);
	await client.connect();
	try {
		log.info(`Trying to create data`);
		const result = await createData();
		log.info(`Data created: ${result}`);
	}
	catch(e){
		log.error(`Couldn't create test data ${e.message}`)
	}
	finally {
		await client.disconnect();
	}
});

async function createData() {
	const genresSchema = new client.mongoose.Schema({
		name: String,
		tags: [String],
		date: {type: Date, default: Date.now}, // default - to not specify creation date explicitly
		isStock: Boolean
	});

	const Genre = client.mongoose.model('Genre', genresSchema);
	const genre = new Genre(
		{
			name: 'Super Horror 2',
			tags: ['With Friends', 'Murder', 'For evening', 'ALLSasdasda'],
			isStock: true
		}
	);
	// await Genre.updateMany(require('../data/db_fixtures/genres'));
	// await genre.save();
	return Genre.find()
}

