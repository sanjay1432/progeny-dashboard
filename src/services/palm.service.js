import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const updatePalm = payload => {
  return axiosApiInstance
    .post(`${API_URL}/update-palm`, payload)
    .then(response => {
      return response.data
    })
}

const getPalmData = (payload) => {
  const {trialId, estateId} = payload
  return axiosApiInstance.get(`${API_URL}/palm?trialId=${trialId}&estateId=${estateId}`).then(response => {
    return response.data
  })
}

const PalmService = {
  updatePalm,
  getPalmData
}

export default PalmService
