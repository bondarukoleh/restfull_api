const {expect} = require('chai');
const {api: {coursesApi}} = require('../../test_objects');

describe('Basic CRUD Suite', function () {
	describe('Courses suite', function () {
		it('GET courses array', async function () {
			const {status, body} = await coursesApi.getCourses();
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Courses array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET course by id', async function () {
			const courseName = 'Course to check';
			let courseId = null;
			{
				const {status, body} = await coursesApi.postCourse({name: courseName});
				expect(status).to.eq(201, `Status should be 200`);
				expect(body.name).to.eq(courseName, `Created course should be with name ${courseName}`);
				courseId = body.id;
			}
			{
				const {status, body} = await coursesApi.getCourse({id: courseId});
				expect(status).to.eq(200, `Status should be 200`);
				expect(body.name).to.eq(courseName, `Course with id ${courseId} name should be ${courseName}`);
			}
		});

		it('POST course', async function () {
			const courseName = 'New course';
			const {status, body} = await coursesApi.postCourse({name: courseName});
			expect(status).to.eq(201, `Status should be 200`);
			expect(body.name).to.eq(courseName, `Created course should be with name ${courseName}`);
		});

		it('POST course name less that 3 characters', async function () {
			const errorMessage = `"name" length must be at least 3 characters long`;
			const courseName = 'AB';
			const {status, body} = await coursesApi.postCourse({name: courseName});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});

		it('POST course without name', async function () {
			const errorMessage = `"name" is required`;
			const {status, body} = await coursesApi.postCourse({name: undefined});
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});

		it('PUT course', async function () {
			const creationName = 'Some Course Name';
			const newName = 'New Course Name';
			const info = 'Some additional info';
			let courseId = null;
			{
				const {status, body} = await coursesApi.postCourse({name: creationName});
				expect(status).to.eq(201, `Status should be 200`);
				courseId = body.id;
			}
			{
				const {status} = await coursesApi.putCourse({id: courseId, name: newName, info});
				expect(status).to.eq(204, `Status should be 204`);
			}
			{
				const {status, body} = await coursesApi.getCourse({id: courseId});
				expect(status).to.eq(200, `Status should be 204`);
				expect(body.name).to.eq(newName, `Changed course name should be "${newName}", got "${body.name}"`);
				expect(body.info).to.eq(info, `Changed course should have info property "${info}", got "${body.info}"`);
			}
		});

		it('PUT course with invalid id and data', async function () {
			const creationName = 'Course Name To check';
			const errorMessage = '"name" is not allowed to be empty';
			let courseId = null;
			{
				const {status, body} = await coursesApi.postCourse({name: creationName});
				expect(status).to.eq(201, `Status should be 200`);
				courseId = body.id;
			}
			{
				const {status, body} = await coursesApi.putCourse({id: -1});
				expect(status).to.eq(404, `Status should be 404`);
				expect(body.error).to.include('not found', `Course with invalid id shouldn't be found`);
			}
			{
				const {status, body} = await coursesApi.putCourse({id: courseId, name: ''});
				expect(status).to.eq(400, `Status should be 400`);
				expect(body).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
			}
		});
	});
});
