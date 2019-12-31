const express = require('express');
const router = express.Router();
// const Fawn = require('fawn');

const routes = require('./routes');
const {models: {rental: {Model, validate}, customer, movie}} = require('../db');

// Fawn.init(mongoose);

router.get('/', async (req, res) => {
	const rentals = await Model.find();
	return res.send(rentals);
});

router.post('/', async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});

	const foundCustomer = await customer.Model.findById(req.body.customerId);
	if (!foundCustomer) return res.status(400).send({error: `Invalid customer id.`});

	const foundMovie = await movie.Model.findById(req.body.movieId);
	if (!foundMovie) return res.status(400).send({error: `Invalid movie id.`});

	if(foundMovie.numberInStock === 0) return res.status(400).send({error: `Movie not in stock.`});

	if (value) {
		const newRental = new Model({
			customer: {
				_id: foundCustomer._id,
				name: foundCustomer.name,
				phone: foundCustomer.phone,
			},
			movie: {
				_id: foundMovie._id,
				title: foundMovie.title,
				dailyRentalRate: foundMovie.dailyRentalRate,
			}
		});
		const createdRental = await newRental.save();
		foundMovie.numberInStock--;
		await foundMovie.save();

		/*To make transaction like this action of saving rental and decrement number in stock - we could:
		try {
			new Fawn.Task()
				.save('rentals', createdRental)
				.update('movies', {_id: foundMovie._id}, {$inc: {numberInStock: -1}})
				.run();
		} catch (e) {
			return res.status(500).send(e.message);
		}*/

		return res.status(201).send(createdRental);
	}
});

module.exports = {handler: router, url: routes.rental};
