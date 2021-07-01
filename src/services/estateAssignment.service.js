import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

export const getTrialList = () => {
  return axiosApiInstance.get(`${API_URL}/trial`).then(response => {
    return response.data
  })
}

const getPositionList = () => {
  return axiosApiInstance.get(`${API_URL}/user-position`).then(response => {
    return response.data
  })
}

export const getUserList = () => {
  return axiosApiInstance.get(`${API_URL}/userlist`).then(response => {
    return response.data
  })
}

const assignUserToEstate = payload => {
  return axiosApiInstance
    .put(`${API_URL}/assign-user-to-estate`, payload)
    .then(response => {
      return response.data
    })
}

const EstateAssignmentService = {
  getTrialList,
  getPositionList,
  getUserList,
  assignUserToEstate
}

export default EstateAssignmentService
