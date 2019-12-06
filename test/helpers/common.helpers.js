function errorFormatter({body, status, rest = {}}, requestBody) {
	const restProps = Object.keys(rest).reduce((acc, item) => {
		acc += `\n ${item}: ${JSON.stringify(rest[item], null, '\t')} \n`;
		return acc
	}, '');

	const reqPart = requestBody ? `Request body: ${JSON.stringify(requestBody, null, '\t')} \n` : '';
	const respStatus = `Response status: ${status} \n`;
	const respBody = `Response body: ${JSON.stringify(body, null, '\t')} \n`;

	return reqPart +
		respStatus +
		respBody +
		restProps
}

module.exports = {errorFormatter};
