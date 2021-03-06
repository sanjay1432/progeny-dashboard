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
    .post(`${API_URL}/update-trial`, payload)
    .then(response => {
      return response.data
    })
}

const getTrial = trialCode => {
  return axiosApiInstance
    .get(`${API_URL}/trial?trialCode='${trialCode}'`)
    .then(response => {
      return response.data.data[0]
    })
}

const getTrialTypes = () => {
  return axiosApiInstance
    .get(`${API_URL}/trial-types`)
    .then(response => {
      const {data} = response.data;
      const types = [...new Set(data.map((type) => type.trialType))];
      return types;
    })
}

const updateTrialReplicate = body => {
  return axiosApiInstance
    .post(`${API_URL}/trial/replicate`, body)
    .then(response => {
      return response.data
    })
}

const updateTrialState = (trialId, state) => {
  return axiosApiInstance
    .post(`${API_URL}/update-trial-state?trialId=${trialId}`, {state})
    .then(response => {
      return response.data
    })
}
const TrialService = {
  saveTrial,
  editTrial,
  getTrial,
  getTrialTypes,
  updateTrialReplicate,
  updateTrialState
}

export default TrialService
