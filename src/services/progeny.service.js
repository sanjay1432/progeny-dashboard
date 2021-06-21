import { API_URL } from "../constants"
import axiosApiInstance from "api/api"

const addNewProgeny = payload => {
  return axiosApiInstance.post(`${API_URL}/progeny`, payload).then(response => {
    return response.data
  })
}

const editProgeny = payload => {
  return axiosApiInstance.put(`${API_URL}/progeny`, payload).then(response => {
    return response.data
  })
}

export default {
  addNewProgeny,
  editProgeny
}
