const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class RentalsApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getRentals({queries} = {}){
		return this._apiClient._get({path: Urls.rentals, queries})
	}

	async getRental({id}){
		return this._apiClient._get({path: `${Urls.rentals}/${id}`})
	}

	async postRental(actor, {customerId, movieId}){
		return this._apiClient.post({path: Urls.rentals, body: {customerId, movieId}, token: actor.token})
	}

	async deleteRental(actor, {id}){
		return this._apiClient.delete({path: `${Urls.rentals}/${id}`, token: actor.token})
	}
}

module.exports = {RentalsApi};
