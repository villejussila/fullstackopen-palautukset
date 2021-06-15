import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const { data } = await axios.post(baseUrl, newObject, config)
  return data
}

const update = async (updateObject, id) => {
  const { data } = await axios.put(`${baseUrl}/${id}`, updateObject)
  return data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const { data } = await axios.delete(`${baseUrl}/${id}`, config)
  return data
}

const addComment = async (id, comment) => {
  const { data } = await axios.post(`${baseUrl}/${id}/comments`, {
    text: comment,
  })
  return data
}

export default { getAll, create, update, remove, setToken, addComment }
