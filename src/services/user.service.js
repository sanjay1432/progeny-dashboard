import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

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

export const getEstateList = () => {
  return axiosApiInstance
    .get(`${API_URL}/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}

export const getTrialList = () => {
  return axiosApiInstance.get(`${API_URL}/trial`).then(response => {
    return response.data
  })
}

const addNewUser = payload => {
  return axiosApiInstance.post(`${API_URL}/user`, payload).then(response => {
    return response.data
  })
}

const editUser = payload => {
  return axiosApiInstance.put(`${API_URL}/user`, payload).then(response => {
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

const assignEstateToUser = payload => {
  return axiosApiInstance
    .put(`${API_URL}/assign-estate-to-user`, payload)
    .then(response => {
      return response.data
    })
}

export default {
  getPositionList,
  getUserList,
  getEstateList,
  getTrialList,
  addNewUser,
  editUser,
  assignUserToEstate,
  assignEstateToUser
}
