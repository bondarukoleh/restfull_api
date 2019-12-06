const {apiData: {host}} = require('../../test_data');
const {CoursesApi} = require('./courses.api');

const apiObjects = {
	coursesApi: new CoursesApi(host)
};

module.exports = apiObjects;
