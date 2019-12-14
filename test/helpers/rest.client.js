const fetch = require('node-fetch');
const URL = require('url');
const querystring = require('querystring');
const {apiData: {commonHeaders}} = require('../data');


async function sendRequest(host, method, {path, headers = commonHeaders, body, queries}) {
	const url = formReqUrl(host, path, queries);
	body = headers["Content-Type"] === 'application/json' ? JSON.stringify(body) : body;
	const response = await fetch(url, {method, body, headers});
	let responseHeaders = Array.from(response.headers.entries()).reduce((acc, [key, value]) => (acc[key] = value) && acc, {});
	const responseObject = {status: response.status, url, method, headers: responseHeaders};
	if(responseHeaders['content-type'] && responseHeaders['content-type'].includes("application/json")) {
		responseObject.body = await response.json();
	} else {
		responseObject.body = await response.text();
	}
	return responseObject;
}

function formReqUrl(host, path, queries) {
	if(queries) {
		if(typeof queries === 'string') {
			queries = queries.startsWith('?') ? queries : `?${queries}`
		} else {
			queries = `?${querystring.stringify(queries)}`
		}
		path = `${path}${queries}`
	}
	return URL.resolve(host, path)
}

class BuildRequest {
	constructor(host){
		this.host = host;
	}

	async _get({path, headers, body, queries}){
		return sendRequest(this.host, 'GET', {path, headers, body, queries})
	}
	async post({path, headers, body, queries}){
		return sendRequest(this.host, 'POST', {path, headers, body, queries})
	}
	async delete({path, headers}){
		return sendRequest(this.host, 'DELETE', {path, headers})
	}
	async patch({path, headers, body, queries}){
		return sendRequest(this.host, 'PATCH', {path, headers, body, queries})
	}
	async put({path, headers, body, queries}){
		return sendRequest(this.host, 'PUT', {path, headers, body, queries})
	}
}

module.exports = {BuildRequest};
