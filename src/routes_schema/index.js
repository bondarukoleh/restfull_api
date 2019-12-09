const Joi = require('@hapi/joi');

const postCourse = Joi.object({name: Joi.string().min(3).required()});
const getCourse = Joi.object({id: Joi.string().required()});
const putCourse = Joi.object({name: Joi.string().min(3).required(), info: Joi.string().min(5)});

const Schemas = {
	postCourse,
	getCourse,
	putCourse
};

module.exports = Schemas;
