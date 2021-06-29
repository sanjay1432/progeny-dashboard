import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const saveTrial = payload => {
  return axiosApiInstance.post(`${API_URL}/trial`, payload).then(response => {
    return response.data
  })
}
const editTrial = payload => {
  return axiosApiInstance.put(`${API_URL}/trial`, payload).then(response => {
    return response.data
  })
}
const getTrialReplicates = trialId => {
  return axiosApiInstance
    .get(`${API_URL}/trial/replicates/${trialId}`)
    .then(response => {
      return response.data
    })
}

const updateTrialReplicate = body => {
  return axiosApiInstance
    .put(`${API_URL}/trial/replicate`, body)
    .then(response => {
      return response.data
    })
}
const TrialService = {
  saveTrial,
  editTrial,
  getTrialReplicates,
  updateTrialReplicate
}

export default TrialService
