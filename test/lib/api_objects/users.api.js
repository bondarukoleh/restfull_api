const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class UsersApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getUsers(actor, {queries} = {}){
		return this._apiClient._get({path: Urls.users, queries, token: actor.token})
	}

	async getCurrentUser(actor = {}){
		return this._apiClient._get({path: `${Urls.users}/me`, token: actor.token})
	}

	async postUser(actor, {name, email, password}){
		return this._apiClient.post({path: Urls.users, body: {name, email, password}, token: actor.token})
	}

	async putUser(actor, {id, name, email, password}){
		return this._apiClient.put({path: `${Urls.users}/${id}`, body: {name, email, password}, token: actor.token})
	}

	async deleteUser(actor, {id} = {}){
		return this._apiClient.delete({path: `${Urls.users}/${id}`, token: actor.token})
	}
}

module.exports = {UsersApi};
