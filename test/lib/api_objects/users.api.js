const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class UsersApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getUsers(token, {queries} = {}){
		return this._apiClient._get({path: Urls.users, queries, token})
	}

	async getCurrentUser(token){
		return this._apiClient._get({path: `${Urls.users}/me`, token})
	}

	async createUser(token, {name, email, password}){
		return this._apiClient.post({path: Urls.users, body: {name, email, password}, token})
	}

	async deleteUser(token, {id} = {}){
		return this._apiClient.delete({path: `${Urls.users}/${id}`, token})
	}
}

module.exports = {UsersApi};
