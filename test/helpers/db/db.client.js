const mongoose = require('mongoose');
const getLogger = require('../logger');
const log = getLogger({name: 'DBClient'});

const {DB_HOST, DB_PORT, DB_USER_NAME, DB_USER_PASS, DB_NAME, NODE_ENV} = process.env;
const onProd = NODE_ENV === 'production';
const protocol = onProd ? `mongodb+srv` : `mongodb`;
const defaultOptions = {retryWrites: true, w: 'majority', useNewUrlParser: true, useUnifiedTopology: true};

const getDbUrl = () => {
	const basicDbUrl =  `${protocol}://${DB_USER_NAME}:${DB_USER_PASS}@${DB_HOST}`;
	return onProd ? basicDbUrl : `${basicDbUrl}:${DB_PORT}`;
};

const getDbConnectionUrl = function (dbUrl, databaseName) {
	const basicDbUrl = `${dbUrl}/${databaseName}`;
	return onProd ? basicDbUrl : `${basicDbUrl}?authSource=${databaseName}`;
};

class DBClient {
    constructor({dbUrl = getDbUrl(), options = defaultOptions} = {}) {
        this.mongoose = mongoose;
        this.dbUrl = dbUrl;
        this.options = options;
        this.connection = null;
    }

    async connect(database = DB_NAME) {
        const urlToConnect = getDbConnectionUrl(this.dbUrl, database);
        try {
            log.info(`Connecting to: ${urlToConnect}, with options: %j`, this.options);
            this.connection = await mongoose.connect(urlToConnect, this.options);
            log.info(`BD connected: ${urlToConnect}`);
        } catch (e) {
            log.info(`Fail to connect to DB: ${e.message}`);
            return new Error(`Error while connecting to DB: "${e.message}"`);
        }
        return this.connection;
    }

    async disconnect() {
        try {
            log.info(`Disconnecting from: ${this.dbUrl}, with options: %j`, this.options);
            await this.connection.connection.close();
            log.info(`BD disconnected: ${this.dbUrl}`);
        } catch (e) {
            log.info(`Fail to disconnect to DB: ${e.message}`);
            return new Error(`Error while connecting to DB: "${e.message}"`);
        }
    }
}

module.exports = DBClient;
