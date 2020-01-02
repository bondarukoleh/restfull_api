const customers = require('./customers');
const movies = require('./movies');

const rentals = [
	{
		"_id": "5e0dd7f97882ab597d09e8b6",
		"customer": customers[0],
		"movie": movies[0],
		"rentFee": 1
	},
	{
		"_id": "5e0dd7f97882ab597d09e8b7",
		"customer": customers[1],
		"movie": movies[1],
		"rentFee": 2
	},
	{
		"_id": "5e0dd7f97882ab597d09e8b8",
		"customer": customers[2],
		"movie": movies[2],
		"rentFee": 3
	}
];

module.exports = rentals;
