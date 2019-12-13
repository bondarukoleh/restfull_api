const mongoose = require('mongoose');
const config = require('config');
const {host, port} = config.db;
const log = require('debug')('db:client');

class Mongoose {
	constructor({dbUrl = `${host}:${port}`, options = {useNewUrlParser: true, useUnifiedTopology: true}} = {}){
		this.dbUrl = dbUrl;
		this.options = options;
	}

	async connect(database = 'playground') {
		let res = null;
		try {
			res = await mongoose.connect(`${this.dbUrl}/${database}`, this.options);
			log(`BD connected: ${this.dbUrl}, with options: %j`, this.options)
		} catch (e) {
			throw new Error(`Error while connecting to DB: "${e.message}"`)
		}
		return res;
	}
}

module.exports = Mongoose;
