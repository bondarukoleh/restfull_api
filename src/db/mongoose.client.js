const mongooseClient = require('mongoose');
const config = require('config');
const {host, port, user, password, name} = config.db;
const log = require('debug')('db:client');
const defaultDBUrl = `mongodb://${user}:${password}@${host}:${port}`;

class Mongoose {
	constructor({dbUrl = defaultDBUrl, options = {useNewUrlParser: true, useUnifiedTopology: true}} = {}){
		this.mongoose = mongooseClient;
		this.dbUrl = dbUrl;
		this.options = options;
		this.connection = null;
	}

	async connect(database = name) {
		try {
			const urlToConnect = `${this.dbUrl}/${database}?authSource=${database}`;
			log(`Connecting to: ${urlToConnect}, with options: %j`, this.options);
			this.connection = await this.mongoose.connect(urlToConnect, this.options);
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

	async update({model, objectID, updateObject}){
		const foundObj = await models[model].findById(objectID);
		if (!foundObj) {
			return 'No such Object in DB';
		}
		foundObj.set(updateObject);
		return foundObj.save();
	}
}

module.exports = Mongoose;
