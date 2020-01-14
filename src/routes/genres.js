const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {genre: {Model, validate}}} = require('../db');
const {auth} = require('../middleware');

// function asyncCatchWrapper(asyncFuncToWrap) {
// 	return async function (req, res, next) {
// 		try {
// 			await asyncFuncToWrap(req, res, next);
// 		} catch (e) {
// 			next(e);
// 		}
// 	}
// }

/* one way to do global error handling - is to add your own error handle middleware
We will use package in app.js */
// router.get('/', asyncCatchWrapper(async (req, res) => {
router.get('/', async (req, res) => {
	const genres = await Model.find();
	const {sortBy = null} = req.query;
	sortBy && genres.sort((first, second) => first['name'] > second['name'] ? 1 : first['name'] < second['name'] ? -1 : 0);
	return res.send(genres);
});

router.get('/:id', async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error)	return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const genre = await Model.findById(req.params.id);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
});

router.post('/', auth.isUser, async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const newGenre = new Model({name: value.name});
		const createdGenre = await newGenre.save();
		return res.status(201).send(createdGenre);
	}
});

router.put('/:id', auth.isUser, async (req, res) => {
	{
		const {error} = validate.validateId(req.params);
		if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const {error, value} = validate(req.body);
	if(error) return res.status(400).send({error: error.message});

	const genre = await Model.findById(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	try {
		await genre.set(value).save();
	} catch (e) {
		return res.status(500).send({error: e});
	}
	return res.status(204).send();
});

router.delete('/:id', [auth.isUser, auth.isAdmin], async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const genre = await Model.findByIdAndRemove(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	return res.status(200).send(genre);
});

module.exports = {handler: router, url: routes.genres};
