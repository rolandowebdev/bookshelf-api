const { nanoid } = require('nanoid')
const books = require('./books')

const addBook = (request, h) => {
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload

	const id = nanoid(16)
	const insertedAt = new Date().toISOString()
	const updatedAt = insertedAt
	const finished = pageCount === readPage

	const newBook = {
		id,
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
		finished,
		insertedAt,
		updatedAt,
	}

	if (!name || name === '') {
		return h
			.response({
				status: 'fail',
				message: 'Gagal menambahkan buku. Mohon isi nama buku',
			})
			.code(400)
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400)
	}

	books.push(newBook)
	const isSuccess = books.some((book) => book.id === id)

	if (isSuccess) {
		return h
			.response({
				status: 'success',
				message: 'Buku berhasil ditambahkan',
				data: {
					bookId: id,
				},
			})
			.code(201)
	}

	return h
		.response({
			status: 'fail',
			message: 'Buku gagal ditambahkan',
		})
		.code(500)
}

const getAllBooks = (request, h) => {
	const { name, reading, finished } = request.query

	let bookQuery = books

	if (name) {
		const nameQuery = name.toLowerCase()
		bookQuery = books.filter((book) =>
			book.name.toLowerCase().includes(nameQuery)
		)
	}

	if (reading !== undefined) {
		const isReading = reading === '1'
		bookQuery = books.filter((book) => book.reading === isReading)
	}

	if (finished !== undefined) {
		const isFinished = finished === '1'
		bookQuery = books.filter((book) => book.finished === isFinished)
	}

	const response = {
		status: 'success',
		data: {
			books: bookQuery.map(({ id, name, publisher }) => ({
				id,
				name,
				publisher,
			})),
		},
	}

	return h.response(response).code(200)
}

const getBookById = (request, h) => {
	const { id } = request.params
	const book = books.find((book) => book.id === id)

	if (book) {
		return h
			.response({
				status: 'success',
				data: {
					book,
				},
			})
			.code(200)
	}

	return h
		.response({
			status: 'fail',
			message: 'Buku tidak ditemukan',
		})
		.code(404)
}

const updateBookById = (request, h) => {
	const { id } = request.params
	const {
		name,
		year,
		author,
		summary,
		publisher,
		pageCount,
		readPage,
		reading,
	} = request.payload

	const updatedAt = new Date().toISOString()
	const index = books.findIndex((book) => book.id === id)

	if (!name) {
		return h
			.response({
				status: 'fail',
				message: 'Gagal memperbarui buku. Mohon isi nama buku',
			})
			.code(400)
	}

	if (readPage > pageCount) {
		return h
			.response({
				status: 'fail',
				message:
					'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
			})
			.code(400)
	}

	if (index !== -1) {
		books[index] = {
			...books[index],
			id,
			name,
			year,
			author,
			summary,
			publisher,
			pageCount,
			readPage,
			reading,
			updatedAt,
		}

		return h
			.response({
				status: 'success',
				message: 'Buku berhasil diperbarui',
			})
			.code(200)
	}

	return h
		.response({
			status: 'fail',
			message: 'Gagal memperbarui buku. Id tidak ditemukan',
		})
		.code(404)
}

const deleteBookById = (request, h) => {
	const { id } = request.params
	const index = books.findIndex((book) => book.id === id)

	if (index !== -1) {
		books.splice(index, 1)
		return h
			.response({
				status: 'success',
				message: 'Buku berhasil dihapus',
			})
			.code(200)
	}

	return h
		.response({
			status: 'fail',
			message: 'Buku gagal dihapus. Id tidak ditemukan',
		})
		.code(404)
}

module.exports = {
	addBook,
	getAllBooks,
	getBookById,
	updateBookById,
	deleteBookById,
}
