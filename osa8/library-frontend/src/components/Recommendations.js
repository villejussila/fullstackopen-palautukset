import React, { useEffect, useState } from 'react'
import { useLazyQuery } from '@apollo/client'
import { BOOKS_BY_GENRE } from '../queries'

const Recommendations = ({ show, loggedUser }) => {
  const [user, setUser] = useState()
  const [favoriteGenre, setFavoriteGenre] = useState(null)
  const [getBooksByGenre, booksByGenre] = useLazyQuery(BOOKS_BY_GENRE, {
    variables: { genre: favoriteGenre },
  })

  useEffect(() => {
    if (loggedUser && loggedUser.data) {
      setUser(loggedUser.data.me)
    }
  }, [loggedUser])

  useEffect(() => {
    if (user && user.favoriteGenre) {
      setFavoriteGenre(user.favoriteGenre)
      getBooksByGenre()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (!show) return null
  if (!user) return <div>loading...</div>
  return (
    <div>
      <h2>Recommendations</h2>
      books in your favorite genre <strong>{favoriteGenre || null}</strong>
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
    </div>
  )
}

export default Recommendations
