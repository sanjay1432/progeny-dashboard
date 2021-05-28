import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

const getUpdatedEstateBlocks = () => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}

const assignEstateBlocksToEstate = payload => {
  return axiosApiInstance
    .put(`${API_URL}/v1/general/master-data/estate/map-estate-blocks`, payload)
    .then(response => {
      return response.data
    })
}
export default {
  getUpdatedEstateBlocks,
  assignEstateBlocksToEstate
}
