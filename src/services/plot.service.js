import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getQrCodeDataList = payload => {
  return axiosApiInstance
    .get(`${API_URL}/plot/qrcode/${payload}`)
    .then(response => {
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

const getPalmInformation = () => {
  return axiosApiInstance
    .get(`${API_URL}/plot/PalmInformation`)
    .then(response => {
      return response.data
    })
}

const PlotService = {
  getQrCodeDataList,
  getTrialPlots,
  getPalmInformation,
  editPlot
}

export default PlotService
