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

	async postGenre({name}){
		return this._apiClient.post({path: Urls.genres, body: {name}})
	}

	async putGenre({name, id}){
		return this._apiClient.put({path: `${Urls.genres}/${id}`, body: {name}})
	}

	async deleteGenre({id}){
		return this._apiClient.delete({path: `${Urls.genres}/${id}`})
	}
}

module.exports = {GenresApi};
