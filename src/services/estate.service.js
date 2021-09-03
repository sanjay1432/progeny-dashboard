import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

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
const assignEstateBlocksToMultipleEstate = payload => {
  return axiosApiInstance
    .put(`${API_URL}/estate/map-multiple-estate-blocks`, payload)
    .then((response, err) => {
      if (err) return err
      return response.data
    })
}

const EstateService = {
  getUpdatedEstateBlocks,
  assignEstateBlocksToEstate,
  assignEstateBlocksToMultipleEstate,
  getDesigns
}

export default EstateService
