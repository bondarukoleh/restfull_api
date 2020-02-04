const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {genre, movie: {Model, validate}}} = require('../db');
const {auth, errorHandle: {mongoIdIsValid}, getValidateReqObj} = require('../middleware');
const validateReqObj = getValidateReqObj(validate);

router.get('/', async (req, res) => {
	const movies = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && movies.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(movies);
});

router.get('/:id', mongoIdIsValid, async (req, res) => {
	const movie = await Model.findById(req.params.id);
	if (movie) return res.send(movie);
	return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
});

router.post('/', [auth.isUser, validateReqObj], async (req, res) => {
	const foundGenre = await genre.Model.findById(req.body.genreId);
	if (!foundGenre) return res.status(400).send({error: `Invalid genre id.`});

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
	await newMovie.save();
	return res.status(201).send(newMovie);
});

router.put('/:id', [auth.isUser, mongoIdIsValid, validateReqObj], async (req, res) => {
	let genreToChange = null;
	if(req.body.genreId){
		genreToChange = await genre.Model.findById(req.body.genreId);
		if (!genreToChange) return res.status(404).send({error: `Invalid genre id "${req.body.genreId}"`});
	}

	const movie = await Model.findById(req.params.id);
	if(!movie) return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
	const {title, numberInStock, dailyRentalRate} = req.body;

	const movieToSave = {
		title: title || movie.title,
		numberInStock: numberInStock || movie.numberInStock,
		dailyRentalRate: dailyRentalRate || movie.dailyRentalRate
	};
	if(genreToChange) movieToSave.genre = {_id: genreToChange._id, name: genreToChange.name};

	try {
		await movie.set(movieToSave).save();
	} catch (e) {
		return res.status(500).send({error: e});
	}
	return res.status(204).send();
});

router.delete('/:id', [auth.isUser, mongoIdIsValid], async (req, res) => {
	const movie = await Model.findByIdAndRemove(req.params.id);
	if(!movie) return res.status(404).send({error: `Movie with id: "${req.params.id}" is not found.`});
	return res.send(movie);
});

module.exports = {handler: router, url: routes.movies};
