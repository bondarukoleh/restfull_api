const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {client, models} = require('../db');

router.get('/', async (req, res) => {
	const genres = await models.genre.Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && genres.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(genres);
});

router.get('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const genre = await models.genre.Model.findById(req.params.id);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
});

router.post('/', async (req, res) => {
	const {error, value} = models.genre.validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const newGenre = new models.genre.Model({name: value.name});
		const createdGenre = await newGenre.save();
		return res.status(201).send(createdGenre);
	}
});

router.put('/:id', async (req, res) => {
	const {error, value} = models.genre.validate(req.body);
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	if(error) return res.status(400).send({error: error.message});
	const genre = await models.genre.Model.findById(req.params.id);
	if(!genre) return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
	await genre.set(value).save();
	return res.status(204).send();
});

router.delete('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const genre = await models.genre.Model.findByIdAndRemove(req.params.id);
	if(!genre) return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
	return res.status(200).send(genre);
});


function idIsValid(id){
	return client.mongoose.Types.ObjectId.isValid(id);
}
module.exports = {handler: router, url: routes.genres};
