import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getQrCodeDataList = trialid => {
  return axiosApiInstance
    .get(`${API_URL}/plot/qrcode/${trialid}`)
    .then(response => {
      console.log(response.data)
      return response.data
    })
}

const editPlot = payload => {
  return axiosApiInstance.put(`${API_URL}/plot`, payload).then(response => {
    return response.data
  })
}
const getTrialPlots = trialid => {
  return axiosApiInstance
    .get(`${API_URL}/trial/replicates/plots/${trialid}`)
    .then(response => {
      return response.data
    })
}

export default {
  getQrCodeDataList,
  getTrialPlots,
  editPlot
}
