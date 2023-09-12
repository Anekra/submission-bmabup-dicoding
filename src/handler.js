const books = require('./books')

module.exports = {
  getBooks: {
    method: 'GET',
    path: '/books',
    handler: (request, h) => {
      try {
        let filteredBooks = books
        const queryParams = request.query

        if (Object.keys(queryParams).length > 0) {
          const {
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            finished,
            reading,
            insertedAt,
            updatedAt
          } = queryParams

          if (name) {
            filteredBooks = filteredBooks.filter((book) =>
              book.name.toLowerCase().includes(name.toLowerCase())
            )
          } else if (reading) {
            if (reading === '0') {
              filteredBooks = filteredBooks.filter(
                (book) => book.reading === false
              )
            } else {
              filteredBooks = filteredBooks.filter(
                (book) => book.reading === true
              )
            }
          } else if (finished) {
            if (finished === '0') {
              filteredBooks = filteredBooks.filter(
                (book) => book.finished === false
              )
            } else {
              filteredBooks = filteredBooks.filter(
                (book) => book.finished === true
              )
            }
          } else if (year) {
            filteredBooks = filteredBooks.filter(
              (book) => book.year === parseInt(year)
            )
          } else if (author) {
            filteredBooks = filteredBooks.filter((book) =>
              book.author.toLowerCase().includes(author.toLowerCase())
            )
          } else if (summary) {
            filteredBooks = filteredBooks.filter((book) =>
              book.summary.toLowerCase().includes(summary.toLowerCase())
            )
          } else if (publisher) {
            filteredBooks = filteredBooks.filter((book) =>
              book.publisher.toLowerCase().includes(publisher.toLowerCase())
            )
          } else if (pageCount) {
            filteredBooks = filteredBooks.filter(
              (book) => book.pageCount === parseInt(pageCount)
            )
          } else if (readPage) {
            filteredBooks = filteredBooks.filter(
              (book) => book.readPage === parseInt(readPage)
            )
          } else if (insertedAt) {
            filteredBooks = filteredBooks.filter(
              (book) => book.insertedAt === parseInt(insertedAt)
            )
          } else if (updatedAt) {
            filteredBooks = filteredBooks.filter(
              (book) => book.updatedAt === parseInt(updatedAt)
            )
          } else {
            return h
              .response({
                status: 'fail',
                message: `Gagal menampilkan data buku, data buku tidak memiliki atribut ${queryParams.toString}`
              })
              .code(400)
          }
        }

        const allBooks = {
          books: filteredBooks.map((book) => ({
            id: book.id,
            name: book.name,
            publisher: book.publisher
          }))
        }

        return h
          .response({
            status: 'success',
            data: allBooks
          })
          .code(200)
      } catch (error) {
        console.log(error)
        return h
          .response({
            status: 'fail',
            message: `Gagal menampilkan data buku: ${error}`
          })
          .code(400)
      }
    }
  },

  getBookById: {
    method: 'GET',
    path: '/books/{bookId}',
    handler: (request, h) => {
      try {
        const bookId = request.params.bookId
        const book = books.find((b) => b.id === bookId)

        if (!book) {
          return h
            .response({
              status: 'fail',
              message: 'Buku tidak ditemukan'
            })
            .code(404)
        }

        return h
          .response({
            status: 'success',
            data: {
              book
            }
          })
          .code(200)
      } catch (error) {
        return h
          .response({
            status: 'fail',
            message: `Buku tidak ditemukan ${error}`
          })
          .code(400)
      }
    }
  },

  addBook: {
    method: 'POST',
    path: '/books',
    handler: (request, h) => {
      try {
        const newBook = request.payload
        newBook.id = Math.random().toString(36).substring(2, 9)
        newBook.finished = newBook.pageCount === newBook.readPage
        newBook.insertedAt = new Date().toISOString()
        newBook.updatedAt = newBook.insertedAt

        if (newBook.name && newBook.readPage <= newBook.pageCount) {
          books.push(newBook)

          return h
            .response({
              status: 'success',
              message: 'Buku berhasil ditambahkan',
              data: {
                bookId: newBook.id
              }
            })
            .code(201)
        } else if (!newBook.name && newBook.readPage <= newBook.pageCount) {
          return h
            .response({
              status: 'fail',
              message: 'Gagal menambahkan buku. Mohon isi nama buku'
            })
            .code(400)
        } else {
          return h
            .response({
              status: 'fail',
              message:
                'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400)
        }
      } catch (error) {
        return h
          .response({
            status: 'fail',
            message: `Gagal menambahkan buku: ${error}`
          })
          .code(400)
      }
    }
  },

  updateBook: {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: (request, h) => {
      try {
        const bookId = request.params.bookId
        const bookIndex = books.findIndex((b) => b.id === bookId)

        if (bookIndex === -1) {
          return h
            .response({
              status: 'fail',
              message: 'Gagal memperbarui buku. Id tidak ditemukan'
            })
            .code(404)
        }

        const updatedBook = request.payload
        updatedBook.id = bookId
        updatedBook.finished = updatedBook.pageCount === updatedBook.readPage
        updatedBook.insertedAt = books[bookIndex].insertedAt
        updatedBook.updatedAt = new Date().toISOString()

        if (updatedBook.name && updatedBook.readPage <= updatedBook.pageCount) {
          books[bookIndex] = updatedBook

          return h
            .response({
              status: 'success',
              message: 'Buku berhasil diperbarui'
            })
            .code(200)
        } else if (
          !updatedBook.name &&
          updatedBook.readPage <= updatedBook.pageCount
        ) {
          return h
            .response({
              status: 'fail',
              message: 'Gagal memperbarui buku. Mohon isi nama buku'
            })
            .code(400)
        } else {
          return h
            .response({
              status: 'fail',
              message:
                'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
            })
            .code(400)
        }
      } catch (error) {
        return h
          .response({
            status: 'fail',
            message: `Gagal memperbarui buku: ${error}`
          })
          .code(400)
      }
    }
  },

  deleteBook: {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: (request, h) => {
      try {
        const bookId = request.params.bookId
        const bookIndex = books.findIndex((b) => b.id === bookId)

        if (bookIndex === -1) {
          return h
            .response({
              status: 'fail',
              message: 'Buku gagal dihapus. Id tidak ditemukan'
            })
            .code(404)
        }

        books.splice(bookIndex, 1)

        return h
          .response({
            status: 'success',
            message: 'Buku berhasil dihapus'
          })
          .code(200)
      } catch (error) {
        return h
          .response({
            status: 'fail',
            message: `Buku gagal dihapus: ${error}`
          })
          .code(400)
      }
    }
  }
}
