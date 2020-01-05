const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../data');

class LoginApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async login({email, password}){
		return this._apiClient.post({path: Urls.auth, body: {email, password}})
	}
}

module.exports = {LoginApi};
