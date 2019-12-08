const Joi = require('joi');

const postCourse = {name: Joi.string().min(3).required()};

const Schemas = {
	postCourse
};

module.exports = Schemas;
