const {BuildRequest} = require('../../helpers/rest.client');
const {apiData: {Urls}} = require('../../test_data');

class CoursesApi {
	constructor(host) {
		this._apiClient = new BuildRequest(host);
	}

	async getCourses({queries} = {}){
		return this._apiClient._get({path: Urls.courses, queries})
	}

	async getCourse({id}){
		return this._apiClient._get({path: `${Urls.courses}/${id}`})
	}

	async postCourse({name}){
		return this._apiClient.post({path: Urls.courses, body: {name}})
	}

	async putCourse({name, info, id}){
		return this._apiClient.put({path: `${Urls.courses}/${id}`, body: {name, info}})
	}
}

module.exports = {CoursesApi};
