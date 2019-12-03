const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	console.log(`We have a 'GET' request: ${req.url}`);
	res.write('Hi man!');
	return res.send()
});

app.get('/api/courses', (req, res) => {
	const courses = [1, 2, 3];
	return res.send(courses)
});

app.listen(port, () => console.log(`App listening on port ${port}.`));
