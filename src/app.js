const express = require('express');
const Schemas = require('./routes_schema');
const {routes, genres} = require('./data');
const {PORT} = process.env;

const app = express();
app.use(express.json()); //adding a middleware to parse json to objects

const port = PORT || 3000;

app.get('/', (req, res) => {
	return res.write('Hi man!').send();
});

app.get(routes.genres, (req, res) => {
	const {query: {sortBy = null}} = req;
	const genresCopy = [...genres];
	sortBy && genresCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(genresCopy);
});

app.get(routes.genre, (req, res) => {
	let reqId = null;
	reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if (genre) return res.send(genre);
	return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
});

app.get(routes.multiple, (req, res) => {
	return res.write(JSON.stringify(req.params)).send();
});

app.post(routes.genres, (req, res) => {
	const {error, value} = Schemas.postCourse.validate(req.body);
	if (error) return res.status(400).send({error: error.message});
	if (value) {
		const genre = {
			id: genres.length+1,
			name: value.name
		};
		genres.push(genre);
		return res.status(201).send(genre);
	}
});

app.put(routes.genre, (req, res) => {
	const {error, value} = Schemas.putCourse.validate(req.body);
	let reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if(!genre) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	if(error) return res.status(400).send({error: error.message});
	if (genre) {
		for (const [key, _value] of Object.entries(value)) {
			genre[key] = _value;
		}
		return res.status(204).send();
	}
});

app.delete(routes.genre, (req, res) => {
	let reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if(!genre) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	genres.splice(genres.indexOf(genre), 1);
	return res.status(200).send(genre);
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
