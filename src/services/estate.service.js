import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

const getUpdatedEstateBlocks = () => {
  return axiosApiInstance
    .get(`${API_URL}/estate/estate-blocks`)
    .then(response => {
      return response.data
    })
}

const getDesigns = () => {
  return axiosApiInstance.get(`${API_URL}/design`).then(response => {
    return response.data
  })
}

const assignEstateBlocksToEstate = payload => {
  return axiosApiInstance
    .put(`${API_URL}/estate/map-estate-blocks`, payload)
    .then((response, err) => {
      if (err) return err
      return response.data
    })
}
export default {
  getUpdatedEstateBlocks,
  assignEstateBlocksToEstate,
  getDesigns
}
