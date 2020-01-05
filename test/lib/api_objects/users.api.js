const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class UsersApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getUsers({queries} = {}){
		return this._apiClient._get({path: Urls.users, queries})
	}

	async getCurrentUser({token}){
		return this._apiClient._get({path: `${Urls.users}/me`, token})
	}

	async createUser({name, email, password}){
		return this._apiClient.post({path: Urls.users, body: {name, email, password}})
	}

	async deleteUser({id, token}){
		return this._apiClient.delete({path: `${Urls.users}/${id}`, token})
	}
}

module.exports = {UsersApi};
