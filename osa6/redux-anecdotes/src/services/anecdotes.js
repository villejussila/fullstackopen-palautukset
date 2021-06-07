import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}
const createNew = async (content) => {
  const object = { content, votes: 0 }
  const { data } = await axios.post(baseUrl, object)
  return data
}
const update = async (id, anecdote) => {
  const object = { content: anecdote.content, votes: anecdote.votes }
  const { data } = await axios.put(`${baseUrl}/${id}`, object)
  return data
}

export default { getAll, createNew, update }
