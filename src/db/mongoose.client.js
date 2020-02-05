const mongooseClient = require('mongoose');
const config = require('config');
const {db: {host, port, user, password, name, protocol}, env} = config;
const log = require('debug')('db:client');
const defaultOption = {retryWrites: true, w: 'majority', useNewUrlParser: true, useUnifiedTopology: true};

const getDbUrl = () => {
	const basicDbUrl =  `${protocol}://${user}:${password}@${host}`;
	return env === 'production' ? basicDbUrl : `${basicDbUrl}:${port}`;
};

const getDbConnectionUrl = function (dbUrl, databaseName) {
	const basicDbUrl = `${dbUrl}/${databaseName}`;
	return env === 'production' ? basicDbUrl : `${basicDbUrl}?authSource=${databaseName}`;
};

class Mongoose {
	constructor({dbUrl = getDbUrl(), options = defaultOption} = {}){
		this.mongoose = mongooseClient;
		this.dbUrl = dbUrl;
		this.options = options;
		this.connection = null;
		this.connectionUrl = null;
	}

	async connect(database = name) {
		try {
			this.connectionUrl = getDbConnectionUrl(this.dbUrl, database);
			log(`Connecting to: ${this.connectionUrl}, with options: %j`, this.options);
			this.connection = await this.mongoose.connect(this.connectionUrl, this.options);
			log(`BD connected: ${this.dbUrl}`);
		} catch (e) {
			log(`Fail to connect to DB: ${e.message}`);
			throw new Error(`Error while connecting to DB: "${e.message}"`)
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
			throw new Error(`Error while connecting to DB: "${e.message}"`)
		}
	}
}

module.exports = Mongoose;
