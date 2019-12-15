const mongoose = require('mongoose');
const config = require('config');
const {host, port} = config.db;
const log = require('debug')('db:client');

class Mongoose {
	constructor({dbUrl = `mongodb://${host}:${port}`, options = {useNewUrlParser: true, useUnifiedTopology: true}} = {}){
		this.mongoose = mongoose;
		this.dbUrl = dbUrl;
		this.options = options;
		this.connection = null;
	}

	async connect(database = 'playground') {
		try {
			log(`Connecting to: ${this.dbUrl}, with options: %j`, this.options);
			this.connection = await mongoose.connect(`${this.dbUrl}/${database}`, this.options);
			log(`BD connected: ${this.dbUrl}`);
		} catch (e) {
			log(`Fail to connect to DB: ${e.message}`);
			return new Error(`Error while connecting to DB: "${e.message}"`)
		}
		return this.connection;
	}

	async disconnect(){
		try {
			log(`Disconnecting from: ${this.dbUrl}, with options: %j`, this.options);
			await this.connection.connection.close();
			log(`BD disconnected: ${this.dbUrl}`);
		} catch (e) {
			log(`Fail to disconnect to DB: ${e.message}`);
			return new Error(`Error while connecting to DB: "${e.message}"`)
		}
	}
}

module.exports = Mongoose;
