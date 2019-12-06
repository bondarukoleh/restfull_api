const http = require('info/someCode/http');

const server = http.createServer((req, res) => {
	if(req.method === 'GET') {
		console.log(`We have a 'GET' request: ${req.url}`);
		res.write('Hi man!');
	}
	return res.end();
});

server.on('connection', (socket) => console.log(`We have a connection.`));

server.listen(3000, () => console.log(`Listening on ${3000}`));
