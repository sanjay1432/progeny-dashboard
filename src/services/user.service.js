import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getPositionList = () => {
  return axiosApiInstance.get(`${API_URL}/user-position`).then(response => {
    return response.data
  })
}

export const getUserList = () => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/userlist`)
    .then(response => {
      return response.data
    })
}

export const getEstateList = () => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/estate/estate-blocks`)
    .then(response => {
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

export default {
  getPositionList,
  getUserList,
  getEstateList,
  addNewUser,
  editUser
}
