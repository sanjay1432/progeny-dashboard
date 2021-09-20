import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getDashboardData = type => {
  return axiosApiInstance.get(`${API_URL}/${type}`).then(response => {
    return response.data
  })
}
const getUpdatedEstateBlocks = () => {
  return axiosApiInstance
    .get(`${API_URL}/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}
const DashboarddataService = {
  getDashboardData,
  getUpdatedEstateBlocks
}

export default DashboarddataService
