const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class MoviesApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getMovies({queries} = {}){
		return this._apiClient._get({path: Urls.movies, queries})
	}

	async getMovie({id}){
		return this._apiClient._get({path: `${Urls.movies}/${id}`})
	}

	async postMovie({title, genreId, numberInStock, dailyRentalRate}){
		return this._apiClient.post({path: Urls.movies, body: {title, genreId, numberInStock, dailyRentalRate}})
	}

	async putMovie({id, title, genreId, numberInStock, dailyRentalRate}){
		return this._apiClient.put({path: `${Urls.movies}/${id}`, body: {title, genreId, numberInStock, dailyRentalRate}})
	}

	async deleteMovie({id}){
		return this._apiClient.delete({path: `${Urls.movies}/${id}`})
	}
}

module.exports = {MoviesApi};
