const express = require('express');
const {PORT} = process.env;

const app = express();
app.use(express.json()); //adding a middleware to parse json to objects

const port = PORT || 3000;
const courses = [{id: 0, name: 'C'}, {id: 1, name: 'B'}, {id: 2, name: 'A'}];

app.get('/', (req, res) => {
	console.log(`We have a 'GET' request: ${req.url}`);
	res.write('Hi man!');
	return res.send()
});

app.get('/api/courses', (req, res) => {
	const {query: {sortBy = null}} = req;
	res.write(`Query parameters is "${JSON.stringify(req.query)}" \n`); // stored as object, key=value, {sortBy:"name"}
	const coursesCopy = [...courses];
	sortBy && coursesCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	res.write(`Courses ${JSON.stringify(coursesCopy, null, '  ')}`);
	return res.send()
});

app.get('/api/courses/:id', (req, res) => {
	let response = {};
	let reqId = null;
	let course = null;
	if (req.params && req.params.id) {
		reqId = parseInt(req.params.id);
		course = courses.find(({id}) => id === reqId);
	}
	if (course) {
		response.requestData = `Parameters is "${JSON.stringify(req.params)}"`;
		response.message = `Found course: "${JSON.stringify(course)}"`
	} else {
		res.status(404);
		response.message = `Course with id: "${reqId}" is not found.`
	}
	res.send(response);
});

app.get('/api/multiPrams/:id/:id2', (req, res) => {
	res.write(JSON.stringify(req.params));
	return res.send()
});

app.post('/api/courses', (req, res) => {
	console.log('Got data'); // TODO: remove it
	console.log(JSON.stringify(req.body)); // TODO: remove it
	const response = {};
	const {name} = req.body;
	if (name && name.length) {
		const course = {
			id: ++courses.length,
			name: name
		};
		courses.push(course);
		response.message = `Course ${JSON.stringify(courses[course.id])} created`;
		res.status(201);
	} else {
		response.message = `Course with name: "${name}" not created`;
		res.status(404);
	}
	res.send(response)
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
