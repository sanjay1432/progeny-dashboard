import { API_URL } from "../constants"
import axiosApiInstance from "api/api"

const createProgeny = payload => {
  return axiosApiInstance
    .post(`${API_URL}/create-progeny`, payload)
    .then(response => {
      return response.data
    })
}

const updateProgeny = payload => {
  return axiosApiInstance
    .put(`${API_URL}/update-progeny`, payload)
    .then(response => {
      return response.data
    })
}

const ProgenyService = {
  createProgeny,
  updateProgeny
}

export default ProgenyService
