const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class GenresApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getGenres({queries} = {}){
		return this._apiClient._get({path: Urls.genres, queries})
	}

	async getGenre({id}){
		return this._apiClient._get({path: `${Urls.genres}/${id}`})
	}

	async postGenre(actor, {name}){
		return this._apiClient.post({path: Urls.genres, body: {name}, token: actor.token})
	}

	async putGenre(actor, {name, id}){
		return this._apiClient.put({path: `${Urls.genres}/${id}`, body: {name}, token: actor.token})
	}

	async deleteGenre(actor, {id}){
		return this._apiClient.delete({path: `${Urls.genres}/${id}`, token: actor.token})
	}
}

module.exports = {GenresApi};
