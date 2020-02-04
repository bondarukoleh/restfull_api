const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const routes = require('./routes');
const {models: {auth: {validate}, user: {Model}}} = require('../db');
const {getValidateReqObj} = require('../middleware');
const validateReqObj = getValidateReqObj(validate);

router.post('/', validateReqObj, async (req, res) => {
	const user = await Model.findOne({email: req.body.email});
	if(!user) return res.status(400).send({error: `Invalid Email or Password.`});

	const invalidPassword = bcrypt.compare(req.body.password, user.password);
	if(!invalidPassword) return res.status(400).send({error: `Invalid Email or Password.`});

	const token = user.generateToken();
	/* express will set status code 200 by default */
	return res.send({token})
});

module.exports = {handler: router, url: routes.auth};
