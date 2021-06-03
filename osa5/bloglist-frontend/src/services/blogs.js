import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
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

export default { getAll, create, update, remove, setToken }
