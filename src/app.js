require('./helpers').common.setEnvironmentVariables();
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('config');

const {authentication, logger} = require('./middleware');
const {routes, genres} = require('./data');
const Schemas = require('./routes_schema');
const {PORT = 3000, DEBUG = true} = process.env;

const app = express();
app.use(express.json()); // for application/json
app.use(express.urlencoded({extended: true})); // for application/x-www-form-urlencoded
app.use(helmet()); // increases security
DEBUG && app.use(morgan(`Got ":method" to ":url". Returning ":status"  in ":response-time ms"`)); // logger, writes to terminal but could be setup to file
console.log(`app is in: ${app.get('env')}`); //if NODE_ENV isn't set - development, otherwise - it's value. Needs to be set before app
console.log(`App name: ${config.name}`);

app.use(express.static('./src/public')); // static serving from public folder
app.use(logger);
app.use(authentication);

app.get('/', (req, res) => {
	console.log(`query`, req.query);
	console.log(`params`, req.params);
	console.log(`body`, req.body);
	return res.send('Hi man!');
});

app.get(routes.genres, (req, res) => {
	const {query: {sortBy = null}} = req;
	const genresCopy = [...genres];
	sortBy && genresCopy.sort((first, second) => Number(first[sortBy] > second[sortBy]));
	return res.send(genresCopy);
});

app.get(routes.genre, (req, res) => {
	const reqId = parseInt(req.params.id);
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
	const reqId = parseInt(req.params.id);
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
	const reqId = parseInt(req.params.id);
	const genre = genres.find(({id}) => id === reqId);
	if(!genre) return res.status(404).send({error: `Course with id: "${reqId}" is not found.`});
	genres.splice(genres.indexOf(genre), 1);
	return res.status(200).send(genre);
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}.`));
