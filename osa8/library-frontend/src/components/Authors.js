import React, { useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { ALL_AUTHORS, EDIT_AUTHOR_BORN } from '../queries'

const Authors = (props) => {
  const [authorNames, setAuthorNames] = useState([])
  const [selectedAuthorName, setSelectedAuthorName] = useState()
  const [authors, setAuthors] = useState()
  const [born, setBorn] = useState('')
  const [setBirthYear] = useMutation(EDIT_AUTHOR_BORN, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  })

  useEffect(() => {
    if (!props.authors.data) return
    setAuthors(props.authors.data.allAuthors)
    setAuthorNames(props.authors.data.allAuthors.map((a) => a.name))
  }, [props.authors])

  useEffect(() => {
    if (!props.authors.data) return
    if (!props.authors.data.allAuthors[0]) return
    if (!selectedAuthorName) {
      setSelectedAuthorName(props.authors.data.allAuthors[0].name)
    }
  }, [props.authors.data, selectedAuthorName])

  if (!props.show) {
    return null
  }
  if (props.authors.loading) return <div>loading...</div>

  const handleUpdateAuthor = () => {
    const yearBorn = Number(born)
    setBirthYear({ variables: { name: selectedAuthorName, born: yearBorn } })
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors &&
            authors.map((a) => (
              <tr key={a.name}>
                <td>{a.name}</td>
                <td>{a.born}</td>
                <td>{a.bookCount}</td>
              </tr>
            ))}
        </tbody>
      </table>
      <div>
        <h2>Set birthyear</h2>
        <select
          value={selectedAuthorName}
          onChange={({ target }) => setSelectedAuthorName(target.value)}
        >
          {authorNames.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          ></input>
          <button onClick={handleUpdateAuthor}>update author</button>
        </div>
      </div>
    </div>
  )
}

export default Authors
