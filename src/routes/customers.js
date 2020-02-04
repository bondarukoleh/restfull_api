const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {customer: {validate, Model}}} = require('../db');
const {auth, errorHandle: {mongoIdIsValid}, getValidateReqObj} = require('../middleware');
const validateReqObj = getValidateReqObj(validate);

router.get('/', async (req, res) => {
	const customers = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && customers.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(customers);
});

router.get('/:id', mongoIdIsValid, async (req, res) => {
	const customer = await Model.findById(req.params.id);
	if (customer) return res.send(customer);
	return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
});

router.post('/', [auth.isUser, auth.isAdmin, validateReqObj], async (req, res) => {
	const createdCustomer = await (new Model({name: req.body.name, phone: req.body.phone})).save();
	return res.status(201).send(createdCustomer);
});

router.put('/:id', [auth.isUser, mongoIdIsValid, validateReqObj], async (req, res) => {
	const customer = await Model.findById(req.params.id);
	if(!customer) return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
	try {
		await customer.set(req.body).save();
	} catch (e) {
		return res.status(500).send({error: e});
	}
	return res.status(204).send();
});

router.delete('/:id', auth.isUser, async (req, res) => {
	const customer = await Model.findByIdAndRemove(req.params.id);
	if(!customer) return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
	return res.status(200).send(customer);
});

module.exports = {handler: router, url: routes.customers};
