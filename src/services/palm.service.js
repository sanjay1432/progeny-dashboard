import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const updatePalm = payload => {
  return axiosApiInstance
    .put(`${API_URL}/update-palm`, payload)
    .then(response => {
      return response.data
    })
}

const getPalmData = () => {
  return axiosApiInstance.get(`${API_URL}/palm`).then(response => {
    return response.data
  })
}

const PalmService = {
  updatePalm,
  getPalmData
}

export default PalmService
