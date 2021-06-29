import React, { useState, useEffect } from 'react'
import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const Books = (props) => {
  const [filterGenre, setFilterGenre] = useState(null)
  const [getBooksByGenre, booksByGenre] = useLazyQuery(BOOKS_BY_GENRE, {
    variables: { genre: filterGenre },
    fetchPolicy: 'cache-and-network',
  })
  useEffect(() => {
    getBooksByGenre()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!props.show) {
    return null
  }
  if (props.books.loading) return <div>loading...</div>

  const books = props.books.data.allBooks

  const genreList = books
    .reduce((genres, book) => {
      return genres.concat(book.genres)
    }, [])
    .reduce((uniqueGenres, genre) => {
      if (uniqueGenres.indexOf(genre) === -1) {
        uniqueGenres.push(genre)
      }
      return uniqueGenres
    }, [])

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksByGenre.data &&
            booksByGenre.data.allBooks.map((book) => (
              <tr key={book.title}>
                <td>{book.title}</td>
                <td>{book.author.name}</td>
                <td>{book.published}</td>
              </tr>
            ))}
        </tbody>
      </table>
      {genreList.map((genre) => (
        <button key={genre} onClick={() => setFilterGenre(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilterGenre(null)}>all genres</button>
    </div>
  )
}

export default Books
