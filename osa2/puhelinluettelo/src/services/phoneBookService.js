import axios from "axios";
const BASE_URL = "http://localhost:3001/persons";

const getAll = () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};
const create = (newPerson) => {
  const request = axios.post(BASE_URL, newPerson);
  return request.then((response) => response.data);
};
const deletePersonById = (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  return request.then((response) => response.data);
};
const update = (id, updatePerson) => {
  const request = axios.put(`${BASE_URL}/${id}`, updatePerson);
  return request.then((response) => response.data);
};
/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  getAll,
  create,
  deletePersonById,
  update,
};
