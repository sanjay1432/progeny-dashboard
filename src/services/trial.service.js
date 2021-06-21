import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

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
export default {
  saveTrial,
  editTrial,
  getTrialReplicates
}
