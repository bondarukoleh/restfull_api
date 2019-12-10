const {expect} = require('chai');
const {api: {genresApi}} = require('../../test_objects');
const {apiData: {Statuses}} = require('../../test_data');

async function postGenre(genreName) {
	const {status, body} = await genresApi.postGenre({name: genreName});
	expect(status).to.eq(201, `Status should be ${Statuses['201']}`);
	expect(body.name).to.eq(genreName, `Created genre should be with name ${genreName}`);
	return body.id;
}

async function deleteGenre(id) {
	const {status, body} = await genresApi.deleteGenre({id});
	expect(status).to.eq(200, `Status should be 204`);
	expect(body.id).to.eq(id, `Should return deleted genre with id ${id}, got "${body.id}"`);
}

describe('Basic Genres CRUD Suite', function () {
	describe('GET Genres', function () {
		it('GET genres array', async function () {
			const {status, body} = await genresApi.getGenres();
			expect(status).to.eq(200, `Status should be ${Statuses['200']}`);
			expect(!!body.length).to.eq(true, `Genres array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET genre by id', async function () {
			const genreName = 'Genre to check';
			const genreId = await postGenre(genreName);
			const {status, body} = await genresApi.getGenre({id: genreId});
			expect(status).to.eq(200, `Status should be ${Statuses['200']}`);
			expect(body.name).to.eq(genreName, `Genre with id "${genreId}" name should be "${genreName}"`);
			await deleteGenre(genreId);
		});

		it('GET genre with not existing id', async function () {
			const creationName = 'Genre to get';
			const genreId = await postGenre(creationName);
			const {status, body} = await genresApi.getGenre({id: -1});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('not found', `Genre with invalid id shouldn't be found`);
			await deleteGenre(genreId);
		});
	});
	describe('POST Genres', function () {
		it('POST genre', async function () {
			const genreName = 'New genre';
			const genreId = await postGenre(genreName);
			await deleteGenre(genreId);
		});

		it('POST genre name less that 3 characters', async function () {
			const errorMessage = `"name" length must be at least 3 characters long`;
			const genreName = 'AB';
			const {status, body} = await genresApi.postGenre({name: genreName});
			expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});

		it('POST genre without name', async function () {
			const errorMessage = `"name" is required`;
			const {status, body} = await genresApi.postGenre({name: undefined});
			expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});
	describe('PUT Genres', function () {
		it('PUT genre', async function () {
			const creationName = 'Some Genre Name';
			const newName = 'New Genre Name';
			const info = 'Some additional info';
			const genreId = await postGenre(creationName);
			{
				const {status} = await genresApi.putGenre({id: genreId, name: newName, info});
				expect(status).to.eq(204, `Status should be ${Statuses['204']}`);
			}
			{
				const {status, body} = await genresApi.getGenre({id: genreId});
				expect(status).to.eq(200, `Status should be ${Statuses['204']}`);
				expect(body.name).to.eq(newName, `Changed genre name should be '${newName}', got '${body.name}'`);
				expect(body.info).to.eq(info, `Changed genre should have info property '${info}', got '${body.info}'`);
			}
			await deleteGenre(genreId);
		});

		it('PUT genre with invalid id and data', async function () {
			const creationName = 'Genre Name To check';
			const errorMessage = '"name" is not allowed to be empty';
			const genreId = await postGenre(creationName);
			{
				const {status, body} = await genresApi.putGenre({id: -1});
				expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
				expect(body.error).to.include('not found', `Genre with invalid id shouldn't be found`);
			}
			{
				const {status, body} = await genresApi.putGenre({id: genreId, name: ''});
				expect(status).to.eq(400, `Status should be ${Statuses['400']}`);
				expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body}`);
			}
			await deleteGenre(genreId);
		});
	});

	describe('DELETE Genres', function () {
		it('DELETE genre', async function () {
			const creationName = 'Genre to delete';
			const genreId = await postGenre(creationName);
			await deleteGenre(genreId);
			const {status, body} = await genresApi.getGenres();
			const deletedPresent = body.some(genre => genre.id === genreId);

			expect(status).to.eq(200, `Status should be 200`);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${genreId} shouldn't be present in array`);
		});

		it('DELETE genre with not existing id', async function () {
			const creationName = 'Genre to delete';
			const genreId = await postGenre(creationName);
			const {status, body} = await genresApi.deleteGenre({id: -1});
			expect(status).to.eq(404, `Status should be ${Statuses['404']}`);
			expect(body.error).to.include('not found', `Genre with invalid id shouldn't be found`);
			await deleteGenre(genreId);
		});
	});
});
