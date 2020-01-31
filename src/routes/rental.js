const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {rental: {Model, validate}, customer, movie}} = require('../db');
const {auth, errorHandle: {mongoIdIsValid}} = require('../middleware');

router.get('/', async (req, res) => {
	const rentals = await Model.find();
	return res.send(rentals);
});

router.post('/', auth.isUser, async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});

	const foundCustomer = await customer.Model.findById(req.body.customerId);
	if (!foundCustomer) return res.status(400).send({error: `Customer with id ${req.body.customerId} not found.`});

	const foundMovie = await movie.Model.findById(req.body.movieId);
	if (!foundMovie) return res.status(400).send({error: `Movie with id ${req.body.movieId} not found.`});

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
		// const createdRental = await newRental.save(); // not necessary to save it in some variable
		await newRental.save();
		foundMovie.numberInStock--;

		await foundMovie.save();

		/* To make transaction like this action of saving rental and decrement number in stock - we could:
		const Fawn = require('fawn');
		Fawn.init(mongoose);
		try {
			new Fawn.Task()
				.save('rentals', createdRental)
				.update('movies', {_id: foundMovie._id}, {$inc: {numberInStock: -1}})
				.run();
		} catch (e) {
			return res.status(500).send(e.message);
		} But I don't like it a lot, so will keep it as a note */

		return res.status(201).send(newRental);
	}
});

router.get('/:id', mongoIdIsValid, async (req, res) => {
	const rental = await Model.findById(req.params.id);
	if (rental) return res.send(rental);
	return res.status(404).send({error: `Rental with id: "${req.params.id}" is not found.`});
});

router.delete('/:id', [auth.isUser, mongoIdIsValid], async (req, res) => {
	const rental = await Model.findByIdAndRemove(req.params.id);
	if(!rental) return res.status(404).send({error: `Rental with id: "${req.params.id}" is not found.`});
	return res.status(200).send(rental);
});

module.exports = {handler: router, url: routes.rental};
