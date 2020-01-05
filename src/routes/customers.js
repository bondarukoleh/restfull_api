const express = require('express');
const router = express.Router();

const routes = require('./routes');
const {models: {customer: {validate, Model}}} = require('../db');
const {auth} = require('../middleware');

router.get('/', async (req, res) => {
	const customers = await Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && customers.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(customers);
});

router.get('/:id', async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error) return res.status(404).send({error: error.message});
	const customer = await Model.findById(req.params.id);
	if (customer) return res.send(customer);
	return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
});

router.post('/', [auth.isUser, auth.isAdmin], async (req, res) => {
	const {error, value} = validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const createdCustomer = await (new Model({name: value.name, phone: value.phone})).save();
		return res.status(201).send(createdCustomer);
	}
});

router.put('/:id', auth.isUser, async (req, res) => {
	{
		let {error} = validate.validateId(req.params);
		if(error) return res.status(400).send({error: error.message});
	}
	let {error, value} = validate(req.body);
	if(error) return res.status(400).send({error: error.message});
	const customer = await Model.findById(req.params.id);
	if(!customer) return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
	await customer.set(value).save();
	return res.status(204).send();
});

router.delete('/:id', auth.isUser, async (req, res) => {
	const {error} = validate.validateId(req.params);
	if(error) return res.status(400).send({error: error.message});
	const customer = await Model.findByIdAndRemove(req.params.id);
	if(!customer) return res.status(404).send({error: `Customer with id: "${req.params.id}" is not found.`});
	return res.status(200).send(customer);
});

module.exports = {handler: router, url: routes.customers};
