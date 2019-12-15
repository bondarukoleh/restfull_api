const mongoose = require('mongoose');
const getLogger = require('../logger');

const {DB_HOST, DB_PORT, DB_USER_NAME, DB_USER_PASS} = process.env;
const log = getLogger({name: 'DBClient'});
const defaultOptions = {useNewUrlParser: true, useUnifiedTopology: true};

class DBClient {
	// constructor({dbUrl = `mongodb://${DB_USER_NAME}:${DB_USER_PASS}@${DB_HOST}:${DB_PORT}`, options = defaultOptions} = {}){
	constructor({dbUrl = `mongodb://${DB_HOST}:${DB_PORT}`, options = defaultOptions} = {}){
		this.mongoose = mongoose;
		this.dbUrl = dbUrl;
		this.options = options;
		this.connection = null;
	}

	async connect(database = 'playground') {
		try {
			log.info(`Connecting to: ${this.dbUrl}, with options: %j`, this.options);
			this.connection = await mongoose.connect(`${this.dbUrl}/${database}`, this.options);
			log.info(`BD connected: ${this.dbUrl}`);
		} catch (e) {
			log.info(`Fail to connect to DB: ${e.message}`);
			return new Error(`Error while connecting to DB: "${e.message}"`)
		}
		return this.connection;
	}

	async disconnect(){
		try {
			log.info(`Disconnecting from: ${this.dbUrl}, with options: %j`, this.options);
			await this.connection.connection.close();
			log.info(`BD disconnected: ${this.dbUrl}`);
		} catch (e) {
			log.info(`Fail to disconnect to DB: ${e.message}`);
			return new Error(`Error while connecting to DB: "${e.message}"`)
		}
	}
}

module.exports = DBClient;
