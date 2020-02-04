const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const routes = require('./routes');
const {models: {user: {Model, validate}}} = require('../db');
const {auth, errorHandle: {mongoIdIsValid}, getValidateReqObj} = require('../middleware');
const validateReqObj = getValidateReqObj(validate);

router.get('/', [auth.isUser, auth.isAdmin], async (req, res) => {
	const users = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && users.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(users);
});

/* We don't use /:id endpoint - because someone can brut user ids and get info about other users
   With this /me - we always return info about current user - and criminal cannot get other users info */
router.get('/me', auth.isUser, async (req, res) => {
	const user = await Model.findById(req.user._id).select('-password'); /* to remove pass property from return obj */
	if (user) return res.send(user);
	return res.status(404).send({error: `User with id: "${req.params.id}" is not found.`});
});

router.post('/', [auth.isUser, auth.isAdmin, validateReqObj], async (req, res) => {
	const {error} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});

	const foundUser = await Model.findOne({email: req.body.email});
	if (foundUser) return res.status(404).send({error: `User with email ${req.body.email} is already exists.`});

	const user = new Model(req.body);
	const salt = await bcrypt.genSalt(10);
	user.password = await bcrypt.hash(user.password, salt);
	await user.save();
	const {_id, name, email} = user;
	/* return res.status(201).send(require('lodash').pick(user, ['_id', 'name', 'email']));
	 - we could use lodash to send chosen vars, but for such tiny action I don't want to install whole package */
	/* We won't send the confirmation email for now - so we log in created user here */
	const token = user.generateToken();
	return res.status(201).header('x-auth-token', token).send({_id, name, email});
});

router.put('/:id', [auth.isUser, mongoIdIsValid, validateReqObj], async (req, res) => {
	const user = await Model.findById(req.params.id);
	if(!user) return res.status(404).send({error: `Users with id: "${req.user.id}" is not found.`});
	try {
		await user.set(req.body).save();
	} catch (e) {
		return res.status(500).send({error: e});
	}
	return res.status(204).send();
});

router.delete('/:id', [auth.isUser, auth.isAdmin, mongoIdIsValid], async (req, res) => {
	const user = await Model.findByIdAndRemove(req.params.id);
	if(!user) return res.status(404).send({error: `Users with id: "${req.params.id}" is not found.`});
	return res.status(200).send(user);
});

module.exports = {handler: router, url: routes.users};
