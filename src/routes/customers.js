const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const routes = require('./routes');
const {models} = require('../db');

router.get('/', async (req, res) => {
	const customers = await models.customer.Model.find();
	const {query: {sortBy = null}} = req;
	sortBy && customers.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(customers);
});

router.get('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const customer = await models.customer.Model.findById(req.params.id);
	if (customer) return res.send(customer);
	return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
});

router.post('/', async (req, res) => {
	const {error, value} = models.customer.validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const createdCustomer = await (new models.customer.Model({name: value.name, phone: value.phone})).save();
		return res.status(201).send(createdCustomer);
	}
});

router.put('/:id', async (req, res) => {
	const {error, value} = models.customer.validate(req.body);
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	if(error) return res.status(400).send({error: error.message});
	const customer = await models.customer.Model.findById(req.params.id);
	if(!customer) return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
	await customer.set(value).save();
	return res.status(204).send();
});

router.delete('/:id', async (req, res) => {
	if(!idIsValid(req.params.id)) {
		return res.status(404).send({error: `Id "${req.params.id}" is not valid.`});
	}
	const customer = await models.customer.Model.findByIdAndRemove(req.params.id);
	if(!customer) return res.status(404).send({error: `Course with id: "${req.params.id}" is not found.`});
	return res.status(200).send(customer);
});


function idIsValid(id){
	return mongoose.Types.ObjectId.isValid(id);
}
module.exports = {handler: router, url: routes.customers};
