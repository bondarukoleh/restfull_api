const {expect} = require('chai');
const {api: {coursesApi}} = require('../../test_objects');
const {apiData: {Statuses}} = require('../../test_data');

async function postCourse(courseName) {
	const {status, body} = await coursesApi.postCourse({name: courseName});
	expect(status).to.eq(201, `Status should be ${Statuses['201']}`);
	expect(body.name).to.eq(courseName, `Created course should be with name ${courseName}`);
	return body.id;
}

async function deleteCourse(id) {
	const {status, body} = await coursesApi.deleteCourse({id});
	expect(status).to.eq(200, `Status should be 204`);
	expect(body.id).to.eq(id, `Should return deleted course with id ${id}, got "${body.id}"`);
}

describe('Basic Courses CRUD Suite', function () {
	describe('GET Courses', function () {
		it('GET courses array', async function () {
			const {status, body} = await coursesApi.getCourses();
			expect(status).to.eq(200, `Status should be ${Statuses['200']}`);
			expect(!!body.length).to.eq(true, `Courses array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET course by id', async function () {
			const courseName = 'Course to check';
			let courseId = await postCourse(courseName);
			const {status, body} = await coursesApi.getCourse({id: courseId});
			expect(status).to.eq(200, `Status should be ${Statuses['200']}`);
			expect(body.name).to.eq(courseName, `Course with id ${courseId} name should be ${courseName}`);
			await deleteCourse(courseId);
		});

		it('GET course with not existing id', async function () {
			const creationName = 'Course to get';
			const courseId = await postCourse(creationName);
			const {status, body} = await coursesApi.getCourse({id: -1});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('not found', `Course with invalid id shouldn't be found`);
			await deleteCourse(courseId);
		});
	});
	describe('POST Courses', function () {
		it('POST course', async function () {
			const courseName = 'New course';
			const courseId = await postCourse(courseName);
			await deleteCourse(courseId);
		});

		it('POST course name less that 3 characters', async function () {
			const errorMessage = `"name" length must be at least 3 characters long`;
			const courseName = 'AB';
			const {status, body} = await coursesApi.postCourse({name: courseName});
			expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});

		it('POST course without name', async function () {
			const errorMessage = `"name" is required`;
			const {status, body} = await coursesApi.postCourse({name: undefined});
			expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});
	describe('PUT Courses', function () {
		it('PUT course', async function () {
			const creationName = 'Some Course Name';
			const newName = 'New Course Name';
			const info = 'Some additional info';
			const courseId = await postCourse(creationName);
			{
				const {status} = await coursesApi.putCourse({id: courseId, name: newName, info});
				expect(status).to.eq(204, `Status should be ${Statuses['204']}`);
			}
			{
				const {status, body} = await coursesApi.getCourse({id: courseId});
				expect(status).to.eq(200, `Status should be ${Statuses['204']}`);
				expect(body.name).to.eq(newName, `Changed course name should be '${newName}', got '${body.name}'`);
				expect(body.info).to.eq(info, `Changed course should have info property '${info}', got '${body.info}'`);
			}
			await deleteCourse(courseId);
		});

		it('PUT course with invalid id and data', async function () {
			const creationName = 'Course Name To check';
			const errorMessage = '"name" is not allowed to be empty';
			const courseId = await postCourse(creationName);
			{
				const {status, body} = await coursesApi.putCourse({id: -1});
				expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
				expect(body.error).to.include('not found', `Course with invalid id shouldn't be found`);
			}
			{
				const {status, body} = await coursesApi.putCourse({id: courseId, name: ''});
				expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
				expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
			}
			await deleteCourse(courseId);
		});
	});

	describe('DELETE Courses', function () {
		it('DELETE course', async function () {
			const creationName = 'Course to delete';
			const courseId = await postCourse(creationName);
			await deleteCourse(courseId);
			const {status, body} = await coursesApi.getCourses();
			const deletedPresent = body.some(course => course.id === courseId);

			expect(status).to.eq(200, `Status should be 200`);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${courseId} shouldn't be present in array`);
		});

		it('DELETE course with not existing id', async function () {
			const creationName = 'Course to delete';
			const courseId = await postCourse(creationName);
			const {status, body} = await coursesApi.deleteCourse({id: -1});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('not found', `Course with invalid id shouldn't be found`);
			await deleteCourse(courseId);
		});
	});
});
