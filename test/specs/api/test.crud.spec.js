const {expect} = require('chai');
const {api} = require('../../test_objects');

describe('Basic CRUD Suite', function() {
	describe('Courses suite', function() {
		it('Check GET courses', async function() {
			const {status, body} = await api.coursesApi.getCourses();
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Courses array didn't returned. Return: %j`, body)
		})
	})
});
