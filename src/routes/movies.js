const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const routes = require('./routes');
const {models: {genre, movie: {Model, validate}}} = require('../db');

router.get('/', async (req, res) => {
	const movies = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && movies.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(movies);
});

router.get('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const movie = await Model.findById(req.params.id);
	if (movie) return res.send(movie);
	return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
});

router.post('/', async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});

	const foundGenre = await genre.Model.findById(req.body.genreId);
	if (!foundGenre) return res.status(400).send({error: `Invalid genre id.`});

	if (value) {
		const {title, numberInStock, dailyRentalRate} = req.body;
		const newMovie = new Model({
			title,
			genre: {
				_id: foundGenre._id,
				name: foundGenre.name
			},
			numberInStock,
			dailyRentalRate
		});
		const createdMovie = await newMovie.save();
		return res.status(201).send(createdMovie);
	}
});

router.put('/:id', async (req, res) => {
	const {error} = validate(req.body);
	if(!idIsValid(req.params.id)) return res.status(404).send({error: `Invalid Movie Id "${req.params.id}"`});

	let genreToChange = null;
	if(req.body.genreId){
		genreToChange = await genre.Model.findById(req.body.genreId);
		if (!genreToChange) return res.status(404).send({error: `Invalid genre id "${req.body.genreId}"`});
	}
	if(error) return res.status(400).send({error: error.message});

	const movie = await Model.findById(req.params.id);
	if(!movie) return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
	const {title, numberInStock, dailyRentalRate} = req.body;

	const movieToSave = {
		title: title || movie.title,
		numberInStock: numberInStock || movie.numberInStock,
		dailyRentalRate: dailyRentalRate || movie.dailyRentalRate
	};
	if(genreToChange) movieToSave.genre = {_id: genreToChange._id, name: genreToChange.name};

	await movie.set(movieToSave).save();
	return res.status(204).send();
});

router.delete('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const movie = await Model.findByIdAndRemove(req.params.id);
	if(!movie) return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
	return res.status(200).send(movie);
});


function idIsValid(id){
	return mongoose.Types.ObjectId.isValid(id);
}
module.exports = {handler: router, url: routes.movies};
