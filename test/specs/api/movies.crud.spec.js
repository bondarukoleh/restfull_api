const {expect} = require('chai');
const {api: {moviesApi, genresApi}} = require('../../lib');

async function postMovie({title, genreId, numberInStock, dailyRentalRate}) {
	const {status, body} = await moviesApi.postMovie({title, genreId, numberInStock, dailyRentalRate});
	expect(status).to.eq(201, `Status should be 201`);
	expect(body.title).to.eq(title, `Created movie should be with title ${title}`);
	return body._id;
}

async function deleteMovie(id) {
	const {status, body} = await moviesApi.deleteMovie({id});
	expect(status).to.eq(200, `Status should be 200`);
	expect(body._id).to.eq(id, `Should return deleted movie with id ${id}, got "${body.id}"`);
}

async function getGenres() {
	const {status, body} = await genresApi.getGenres();
	expect(status).to.eq(200, `Status should be 200`);
	expect(!!body.length).to.eq(true, `Genres array didn't returned. Return: ${JSON.stringify(body)}`);
	return body;
}

describe('Basic Movies CRUD Suite', function () {

	const invalidID = '1dffde1111e11e1fa1c111b1';
	let movieObj = null;
	before(async () => {
		movieObj = {
			title: 'New Movie',
			genreId: (await getGenres())[0]._id,
			numberInStock: 10,
			dailyRentalRate: 0
		};
	});

	describe('GET Movies', function () {
		it('GET movies array', async function () {
			const {status, body} = await moviesApi.getMovies();
			expect(status).to.eq(200, `Status should be 200`);
			expect(!!body.length).to.eq(true, `Movies array didn't returned. Return: ${JSON.stringify(body)}`);
		});

		it('GET movie by id', async function () {
			const movie = {...movieObj};
			const movieId = await postMovie(movie);
			const {status, body} = await moviesApi.getMovie({id: movieId});
			expect(status).to.eq(200, `Status should be 200`);
			expect(body.title).to.eq(movie.title, `Movie with id "${movieId}" title should be "${movie.title}"`);
			await deleteMovie(movieId);
		});

		it('GET movie with not existing id', async function () {
			const movie = {...movieObj};
			const movieId = await postMovie(movie);

			const {status, body} = await moviesApi.getMovie({id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('not found', `Movie with invalid id shouldn't be found`);
			await deleteMovie(movieId);
		});
	});

	describe('POST Movies', function () {
		it('POST movie', async function () {
			const movie = {...movieObj};
			const movieId = await postMovie(movie);
			await deleteMovie(movieId);
		});

		it('POST movie title less that 5 characters', async function () {
			const errorMessage = `"title" length must be at least 5 characters long`;
			const movie = {...movieObj};
			movie.title = 'ab';
			const {status, body} = await moviesApi.postMovie(movie);
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include "${errorMessage}"`);
		});

		it('POST movie without name', async function () {
			const errorMessage = `"title" is required`;
			const movie = {...movieObj};
			movie.title = undefined;
			const {status, body} = await moviesApi.postMovie(movie);
			expect(status).to.eq(400, `Status should be 400`);
			expect(body.error).to.include(errorMessage, `Error should include ${errorMessage}`);
		});
	});

	describe('PUT Movies', function () {
		it('PUT movie', async function () {
			const movieCreationName = 'Creation name';
			const movieChangedName = 'New Movie Name';
			const movie = {...movieObj, title: movieCreationName};
			const movieId = await postMovie(movie);
			{
				movie.title = movieChangedName;
				const {status} = await moviesApi.putMovie({id: movieId, ...movie});
				expect(status).to.eq(204, `Status should be 204`);
			}
			{
				const {status, body} = await moviesApi.getMovie({id: movieId});
				expect(status).to.eq(200, `Status should be 204`);
				expect(body.title).to.eq(movieChangedName,
					`Changed movie title should be '${movieChangedName}', got '${body.title}'`);
			}
			await deleteMovie(movieId);
		});

		it('PUT movie with invalid id and data', async function () {
			const errorMessage = '"title" is not allowed to be empty';
			const movie = {...movieObj};
			const movieId = await postMovie(movie);
			{
				const {status, body} = await moviesApi.putMovie({id: invalidID, ...movie});
				expect(status).to.eq(404, `Status should be 404`);
				expect(body.error).to.include('is not found', `Movie with invalid id shouldn't be found`);
			}
			{
				movie.title = '';
				const {status, body} = await moviesApi.putMovie({id: movieId, ...movie});
				expect(status).to.eq(400, `Status should be 400`);
				expect(body.error).to.eq(errorMessage, `Message should be ${errorMessage}, got ${body.error}`);
			}
			await deleteMovie(movieId);
		});
	});

	describe('DELETE Movies', function () {
		it('DELETE movie', async function () {
			const movie = {...movieObj};
			const movieId = await postMovie(movie);
			await deleteMovie(movieId);
			const {status, body} = await moviesApi.getMovies();

			expect(status).to.eq(200, `Status should be 200`);
			const deletedPresent = body.some(movie => movie.id === movieId);
			expect(deletedPresent).to.eq(false, `Deleted item with id ${movieId} shouldn't be present in array`);
		});

		it('DELETE movie with not existing id', async function () {
			const movie = {...movieObj};
			const movieId = await postMovie(movie);
			const {status, body} = await moviesApi.deleteMovie({id: invalidID});
			expect(status).to.eq(404, `Status should be 404`);
			expect(body.error).to.include('is not found', `Movie with invalid id shouldn't be found`);
			await deleteMovie(movieId);
		});
	});
});
