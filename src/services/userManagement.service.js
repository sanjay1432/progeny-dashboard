import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getPositionList = () => {
  return axiosApiInstance.get(`${API_URL}/user-position`).then(response => {
    return response.data
  })
}

export default {
  getPositionList
}
