const genres = require('./genres');

const movies = [
	{
		"_id": "5b77fdc3215eda645bc6bdec",
		"title": "Terminator",
		"genre": genres[0],
		"numberInStock": 10,
		"dailyRentalRate": 0
	},
	{
		"_id": "5b77fdc9815eda645bc6bdec",
		"title": "The Silence of the Lambs",
		"genre": genres[1],
		"numberInStock": 10,
		"dailyRentalRate": 0
	},
	{
		"_id": "5b77fdc7815eda645bc6bdec",
		"title": "Last action hero",
		"genre": genres[2],
		"numberInStock": 10,
		"dailyRentalRate": 0
	},
	{
		"_id": "5b77fdc7915eda045bf6bdec",
		"title": "Indiana Jones",
		"genre": genres[3],
		"numberInStock": 10,
		"dailyRentalRate": 0
	}
];

module.exports = movies;
