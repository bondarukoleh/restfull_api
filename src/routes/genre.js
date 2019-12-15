const express = require('express');
const router = express.Router();
const Joi = require('@hapi/joi');

const routes = require('./routes');
const {genres} = require('../data');
const {client} = require('../db');

const postGenre = Joi.object({name: Joi.string().min(3).required()});
const putGenre = Joi.object({name: Joi.string().min(3).required(), info: Joi.string().min(5)});

router.get('/', async (req, res) => {
	const connection = await client.connect();
	if(connection instanceof Error) return res.status(500).send(connection.message);
	const {query: {sortBy = null}} = req;
	const genresCopy = [...genres];
	sortBy && genresCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	await client.disconnect();
	return res.send(genresCopy);
});

router.get('/:id', (req, res) => {
	const reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
});

router.post('/', (req, res) => {
	const {error, value} = postGenre.validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const genre = {
			id: genres.length+1,
			name: value.name
		};
		genres.push(genre);
		return res.status(201).send(genre);
	}
});

router.put('/:id', (req, res) => {
	const {error, value} = putGenre.validate(req.body);
	const reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if(!genre) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	if(error) return res.status(400).send({error: error.message});
	if (genre) {
		for (const [key, _value] of Object.entries(value)) {
			genre[key] = _value;
		}
		return res.status(204).send();
	}
});

router.delete('/:id', (req, res) => {
	const reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if(!genre) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	genres.splice(genres.indexOf(genre), 1);
	return res.status(200).send(genre);
});

module.exports = {handler: router, url: routes.genres};
