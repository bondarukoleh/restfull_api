const express = require('express');
const Schemas = require('./routes_schema');
const {routes} = require('./data');
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

app.get(routes.courses, (req, res) => {
	const {query: {sortBy = null}} = req;
	const coursesCopy = [...courses];
	sortBy && coursesCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(coursesCopy);
});

app.get(routes.course, (req, res) => {
	const {error, value} = Schemas.getCourse.validate(req.params);
	let response = null;
	let reqId = null;
	let course = null;
	if(error) {
		res.status(400);
		return res.send(error.message)
	}
	if (value) {
		reqId = parseInt(req.params.id);
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

app.get(routes.multiple, (req, res) => {
	res.write(JSON.stringify(req.params));
	return res.send();
});

app.post(routes.courses, (req, res) => {
	const {error, value} = Schemas.postCourse.validate(req.body);
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

app.put(routes.course, (req, res) => {
	const {error: idError, value: idValue} = Schemas.getCourse.validate(req.params);
	const {error: bodyError, value: bodyValue} = Schemas.putCourse.validate(req.body);
	let response;
	let reqId = null;
	let course = null;
	if(!idError && idValue) {
		reqId = parseInt(idValue.id);
		course = courses.find(({id}) => id === reqId);
	}
	if(!course){
		res.status(404);
		response = {error: `Course with id: "${reqId}" is not found.`};
		return res.send(response)
	}
	if(bodyError) {
		res.status(400);
		return res.send(bodyError.message)
	}
	if (course) {
		for (const [key, value] of Object.entries(bodyValue)) {
			course[key] = value;
		}
		res.status(204);
	}
	return res.send(response);
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
