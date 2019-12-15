const mongoose = require('mongoose');
const getLogger = require('../logger');

const {DB_HOST, DB_PORT, DB_USER_NAME, DB_USER_PASS} = process.env;
const log = getLogger({name: 'DBClient'});
const defaultOptions = {useNewUrlParser: true, useUnifiedTopology: true};
const defaultDBUrl = `mongodb://${DB_USER_NAME}:${DB_USER_PASS}@${DB_HOST}:${DB_PORT}`;

class DBClient {
	constructor({dbUrl = defaultDBUrl, options = defaultOptions} = {}){
		this.mongoose = mongoose;
		this.dbUrl = dbUrl;
		this.options = options;
		this.connection = null;
	}

	async connect(database = 'playground') {
		const urlToConnect = `${this.dbUrl}/${database}?authSource=${database}`;
		try {
			log.info(`Connecting to: ${urlToConnect}, with options: %j`, this.options);
			this.connection = await mongoose.connect(urlToConnect, this.options);
			log.info(`BD connected: ${urlToConnect}`);
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
