const EventEmitter = require('events');

class Logger extends EventEmitter {
	log(message) {
		console.log('Message is', message);
		this.emit('messageLogged', message)
	}
}

module.exports = new Logger();
