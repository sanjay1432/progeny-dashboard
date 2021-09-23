import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

export const getEstateList = () => {
  return axiosApiInstance
    .get(`${API_URL}/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}

const assignEstateToUser = payload => {
  return axiosApiInstance
    .post(`${API_URL}/assign-estate-to-user`, payload)
    .then(response => {
      return response.data
    })
}

const UserAssignmentService = {
  getEstateList,
  assignEstateToUser
}

export default UserAssignmentService
