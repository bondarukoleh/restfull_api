const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {genre: {Model, validate}}} = require('../db');
const {auth, errorHandle: {mongoIdIsValid}, getValidateReqObj} = require('../middleware');
const validateReqObj = getValidateReqObj(validate);

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

router.get('/:id', mongoIdIsValid, async (req, res) => {
	const genre = await Model.findById(req.params.id);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
});

router.post('/', [auth.isUser, validateReqObj], async (req, res) => {
	const createdGenre = await new Model({name: req.body.name}).save();
	return res.status(201).send(createdGenre);
});

router.put('/:id', [auth.isUser, mongoIdIsValid, validateReqObj] , async (req, res) => {
	const genre = await Model.findById(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	try {
		await genre.set(req.body).save();
	} catch (e) {
		return res.status(500).send({error: e});
	}
	return res.status(204).send();
});

router.delete('/:id', [auth.isUser, auth.isAdmin, mongoIdIsValid], async (req, res) => {
	const genre = await Model.findByIdAndRemove(req.params.id);
	if(!genre) return res.status(404).send({error: `Genre with id: "${req.params.id}" is not found.`});
	return res.status(200).send(genre);
});

module.exports = {handler: router, url: routes.genres};
