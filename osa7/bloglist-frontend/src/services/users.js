import axios from 'axios'

const baseUrl = '/api/users'

const getAll = async () => {
  const { data } = await axios.get(baseUrl)
  return data
}
const getOne = async (id) => {
  const { data } = await axios.get(`${baseUrl}/${id}`)
  return data
}

export default { getAll, getOne }
