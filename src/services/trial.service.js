import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const saveTrial = payload => {
  return axiosApiInstance
    .post(`${API_URL}/create-trial`, payload)
    .then(response => {
      return response.data
    })
}
const editTrial = payload => {
  return axiosApiInstance
    .put(`${API_URL}/update-trial`, payload)
    .then(response => {
      return response.data
    })
}

const getTrial = trialCode => {
  return axiosApiInstance
    .get(`${API_URL}/trial/${trialCode}`)
    .then(response => {
      return response.data.data
    })
}

const updateTrialReplicate = body => {
  return axiosApiInstance
    .put(`${API_URL}/trial/replicate`, body)
    .then(response => {
      return response.data
    })
}

const updateTrialState = (trialId, state) => {
  return axiosApiInstance
    .post(`${API_URL}/update-trial-state/${trialId}`, {state})
    .then(response => {
      return response.data
    })
}
const TrialService = {
  saveTrial,
  editTrial,
  getTrial,
  updateTrialReplicate,
  updateTrialState
}

export default TrialService
