import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getDashboardData = type => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/${type}`)
    .then(response => {
      return response.data
    })
}
const getUpdatedEstateBlocks = () => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}
export default {
  getDashboardData,
  getUpdatedEstateBlocks
}
