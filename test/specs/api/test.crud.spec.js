const {expect} = require('chai');
const {api} = require('../../test_objects');

describe('Basic CRUD Suite', function () {
	describe('Courses suite', function () {
		const errorMessage = 'Name either less then 3 characters or not provided';

		it('Check GET courses array', async function () {
			const {status, body} = await api.coursesApi.getCourses();
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Courses array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('Check GET course by id', async function () {
			const courseName = 'Course to check';
			let courseId = null;
			{
				const {status, body} = await api.coursesApi.postCourse({name: courseName});
				expect(status).to.eq(201, `Status should be 200`);
				expect(body.name).to.eq(courseName, `Created course should be with name ${courseName}`);
				courseId = body.id;
			}
			{
				const {status, body} = await api.coursesApi.getCourse({id: courseId});
				expect(status).to.eq(200, `Status should be 200`);
				expect(body.name).to.eq(courseName, `Course with id ${courseId} name should be ${courseName}`);
			}
		});

		it('Check POST course', async function () {
			const courseName = 'New course';
			const {status, body} = await api.coursesApi.postCourse({name: courseName});
			expect(status).to.eq(201, `Status should be 200`);
			expect(body.name).to.eq(courseName, `Created course should be with name ${courseName}`);
		});

		it('POST course name less that 3 characters', async function () {
			const courseName = 'AB';
			const {status, body} = await api.coursesApi.postCourse({name: courseName});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});

		it('POST course without name', async function () {
			const {status, body} = await api.coursesApi.postCourse({name: undefined});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});
});
