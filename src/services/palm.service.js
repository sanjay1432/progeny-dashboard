import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const editPalm = payload => {
  return axiosApiInstance.put(`${API_URL}/palm`, payload).then(response => {
    return response.data
  })
}

const getPalmData = () => {
  return axiosApiInstance.get(`${API_URL}/palm`).then(response => {
    return response.data
  })
}

const PalmService = {
  editPalm,
  getPalmData
}

export default PalmService
