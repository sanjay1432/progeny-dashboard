import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const createProgeny = payload => {
  return axiosApiInstance
    .post(`${API_URL}/create-progeny`, payload)
    .then(response => {
      return response.data
    })
}
const deleteProgeny = payload => {
  return axiosApiInstance
    .post(`${API_URL}/delete-progeny`, payload)
    .then(response => {
      return response.data
    })
}
const updateProgeny = payload => {
  return axiosApiInstance
    .post(`${API_URL}/update-progeny`, payload)
    .then(response => {
      return response.data
    })
}

const attachProgeny = (payload, trialId) => {
  return axiosApiInstance
    .post(`${API_URL}/attach-progeny?trialCode=${trialId}`, payload)
    .then(response => {
      return response.data
    })
}

const ProgenyService = {
  createProgeny,
  updateProgeny,
  attachProgeny,
  deleteProgeny
}

export default ProgenyService
