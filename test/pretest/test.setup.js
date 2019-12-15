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
	const genre2 = new Genre(
		{
			name: 'Super Horror',
			tags: ['With Friends', 'Murder', 'For evening', 'ALLS'],
			isStock: true
		}
	);

	await genre2.save();
	return Genre
	.find() // filtering
	// .limit(10) // limitation of result
	// .sort({name: 1}) // sorted by name, -1 - means descending (по убыванию), 1 - ascending (по возрастанию)
	// .select({name: 1, tags: 1}) // choose properties that we want to return from object.

	// return Genre.find({name: {$gt: 10}, someNumber: {$in: [10, 15, 20]}})
}
