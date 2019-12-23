const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class CustomersApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getCustomers({queries} = {}){
		return this._apiClient._get({path: Urls.customers, queries})
	}

	async getCustomer({id}){
		return this._apiClient._get({path: `${Urls.customers}/${id}`})
	}

	async postCustomer({name, phone, isGold}){
		return this._apiClient.post({path: Urls.customers, body: {name, phone, isGold}})
	}

	async putCustomer({name, id, phone, isGold}){
		return this._apiClient.put({path: `${Urls.customers}/${id}`, body: {name, phone, isGold}})
	}

	async deleteCustomer({id}){
		return this._apiClient.delete({path: `${Urls.customers}/${id}`})
	}
}

module.exports = {CustomersApi};
