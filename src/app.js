const express = require('express');
const Schemas = require('./routes_schema');
const {routes} = require('./data');
const {PORT} = process.env;

const app = express();
app.use(express.json()); //adding a middleware to parse json to objects

const port = PORT || 3000;
const courses = [{id: 0, name: 'C'}, {id: 1, name: 'B'}, {id: 2, name: 'A'}];

app.get('/', (req, res) => {
	return res.write('Hi man!').send();
});

app.get(routes.courses, (req, res) => {
	const {query: {sortBy = null}} = req;
	const coursesCopy = [...courses];
	sortBy && coursesCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(coursesCopy);
});

app.get(routes.course, (req, res) => {
	let reqId = null;
	reqId = parseInt(req.params.id);
	const course = courses.find(({id}) => id === reqId);
	if (course) return res.send(course);
	return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
});

app.get(routes.multiple, (req, res) => {
	return res.write(JSON.stringify(req.params)).send();
});

app.post(routes.courses, (req, res) => {
	const {error, value} = Schemas.postCourse.validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const course = {
			id: courses.length,
			name: value.name
		};
		courses.push(course);
		return res.status(201).send(course);
	}
});

app.put(routes.course, (req, res) => {
	const {error, value} = Schemas.putCourse.validate(req.body);
	let reqId = parseInt(req.params.id);
	const course = courses.find(({id}) => id === reqId);
	if(!course) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	if(error) return res.status(400).send({error: error.message});
	if (course) {
		for (const [key, _value] of Object.entries(value)) {
			course[key] = _value;
		}
		return res.status(204).send();
	}
});

app.delete(routes.course, (req, res) => {
	let reqId = parseInt(req.params.id);
	const course = courses.find(({id}) => id === reqId);
	if(!course) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	courses.splice(courses.indexOf(course), 1);
	return res.status(200).send(course);
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
