import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  return axios.get(baseUrl).then((response) => response);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then((response) => response);
};

const update = (id, newObject) => {
  return axios.put(`${baseUrl}/${id}`, newObject).then((response) => response);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response);
};

export default {
  getAll,
  create,
  update,
  remove,
};
