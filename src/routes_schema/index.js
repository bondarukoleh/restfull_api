const Joi = require('@hapi/joi');

const postCourse = Joi.object({name: Joi.string().min(3).required()});
const getCourse = Joi.object({id: Joi.string().required()});

const Schemas = {
	postCourse,
	getCourse
};

module.exports = Schemas;
