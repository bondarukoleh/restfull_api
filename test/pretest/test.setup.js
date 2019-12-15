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
	const genre1 = new Genre(
		{
			name: 'Action',
			tags: ['With Friends', 'Murder', 'For evening'],
			isStock: true
		}
	);

	await genre1.save();
	return Genre.find({name: 'Action'}).limit(10).sort({name: 1}).select({name: 1, tags: 1})
}
