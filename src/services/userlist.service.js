import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getPositionList = () => {
  return axiosApiInstance.get(`${API_URL}/user-position`).then(response => {
    return response.data
  })
}

const createUser = payload => {
  return axiosApiInstance
    .post(`${API_URL}/create-user`, payload)
    .then(response => {
      return response.data
    })
}

const updateUser = payload => {
  return axiosApiInstance
    .post(`${API_URL}/update-user`, payload)
    .then(response => {
      return response.data
    })
}

const UserListService = {
  getPositionList,
  createUser,
  updateUser
}

export default UserListService
