const express = require('express');
const Joi = require('joi');
const Schemas = require('./routes.schema');
const {PORT} = process.env;

const app = express();
app.use(express.json()); //adding a middleware to parse json to objects

const port = PORT || 3000;
const courses = [{id: 0, name: 'C'}, {id: 1, name: 'B'}, {id: 2, name: 'A'}];

app.get('/', (req, res) => {
	console.log(`We have a 'GET' request: ${req.url}`);
	res.write('Hi man!');
	return res.send();
});

app.get('/api/courses', (req, res) => {
	const {query: {sortBy = null}} = req;
	const coursesCopy = [...courses];
	sortBy && coursesCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(coursesCopy);
});

app.get('/api/courses/:id', (req, res) => {
	let response = null;
	let reqId = null;
	let course = null;
	if (req.params && req.params.id) {
		reqId = parseInt(req.params.id);
		console.log('WE HAVE COURSES:', courses);
		course = courses.find(({id}) => id === reqId);
	}
	if (course) {
		response = course;
	} else {
		res.status(404);
		response = {error: `Course with id: "${reqId}" is not found.`};
	}
	res.send(response);
});

app.get('/api/multiPrams/:id/:id2', (req, res) => {
	res.write(JSON.stringify(req.params));
	return res.send();
});

app.post('/api/courses', (req, res) => {
	const {error, value} = Joi.validate(req.body, Schemas.postCourse);
	let response = null;
	if (error) {
		response = {error: error.message};
		res.status(400);
		return res.send(response);
	}

	if (value) {
		const course = {
			id: courses.length,
			name: value.name
		};
		courses.push(course);
		response = courses[course.id];
		res.status(201);
		return res.send(response);
	}
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
