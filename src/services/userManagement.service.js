import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getPositionList = () => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/user-position`)
    .then(response => {
      return response.data
    })
}

export default {
  getPositionList
}
