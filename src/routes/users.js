const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {jwt_ppk} = require('config');

const routes = require('./routes');
const {models: {user: {Model, validate}}} = require('../db');

router.get('/', async (req, res) => {
	const users = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && users.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(users);
});

router.get('/:id', async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error)	return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const user = await Model.findById(req.params.id);
	if (user) return res.send(user);
	return res.status(404).send({error: `User with id: "${req.params.id}" is not found.`});
});

router.post('/', async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});

	let user = await Model.findOne({email: req.body.email});
	if(user) return res.status(404).send({error: `User with email ${req.body.email} is already exists.`});

	if (value) {
		const user = new Model(value);
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(user.password, salt);
		await user.save();
		const {password, ...rest} = user;
		/* return res.status(201).send(require('lodash').pick(user, ['_id', 'name', 'email']));
		 - we could use lodash to send chosen vars, but for such tiny action I don't want to install whole package */
		const token = jwt.sign({_id: user._id}, jwt_ppk);
		return res.status(201).header('x-auth-token', {token}).send(rest);
	}
});

router.put('/:id', async (req, res) => {
	{
		const {error} = validate.validateId(req.params);
		if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const {error, value} = validate(req.body);
	if(error) return res.status(400).send({error: error.message});

	const user = await Model.findById(req.params.id);
	if(!user) return res.status(404).send({error: `Users with id: "${req.params.id}" is not found.`});
	await user.set(value).save();
	return res.status(204).send();
});

router.delete('/:id', async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error) return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	const user = await Model.findByIdAndRemove(req.params.id);
	if(!user) return res.status(404).send({error: `Users with id: "${req.params.id}" is not found.`});
	return res.status(200).send(user);
});

module.exports = {handler: router, url: routes.auth};
