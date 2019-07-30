import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null
const setToken = newToken => {
  token = `bearer ${newToken}`
}

const getAll = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}/comments`)
  return response.data
}

const create = async (id, newObject) => {
  const config = {
    headers: { Authorization: token },
  }
  const response = await axios.post(`${baseUrl}/${id}/comments`, newObject, config)
  return response.data
}

export default { getAll, create, setToken }