const Joi = require('@hapi/joi');

const postCourse = Joi.object({name: Joi.string().min(3).required()});
const putCourse = Joi.object({name: Joi.string().min(3).required(), info: Joi.string().min(5)});

const Schemas = {
	postCourse,
	putCourse
};

module.exports = Schemas;
