const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {genre: {Model, validate}}} = require('../db');
const {authentication} = require('../middleware');

router.get('/', async (req, res) => {
	const genres = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && genres.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(genres);
});

router.get('/:id', async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error)	return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const genre = await Model.findById(req.params.id);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
});

router.post('/', authentication, async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const newGenre = new Model({name: value.name});
		const createdGenre = await newGenre.save();
		return res.status(201).send(createdGenre);
	}
});

router.put('/:id', authentication, async (req, res) => {
	{
		const {error} = validate.validateId(req.params);
		if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const {error, value} = validate(req.body);
	if(error) return res.status(400).send({error: error.message});

	const genre = await Model.findById(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	await genre.set(value).save();
	return res.status(204).send();
});

router.delete('/:id', authentication, async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const genre = await Model.findByIdAndRemove(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	return res.status(200).send(genre);
});

module.exports = {handler: router, url: routes.genres};
