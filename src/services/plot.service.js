import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getPlotData = () => {
  return axiosApiInstance.get(`${API_URL}/plot`).then(response => {
    return response.data
  })
}

const getQrCodeDataList = payload => {
  return axiosApiInstance
    .get(`${API_URL}/plot/qrcode?plotId=${payload}`)
    .then(response => {
      return response.data.data
    })
}

const updatePlot = payload => {
  return axiosApiInstance
    .post(`${API_URL}/update-plot`, payload)
    .then(response => {
      return response.data
    })
}
const getTrialPlots = trialid => {
  return axiosApiInstance
    .get(`${API_URL}/trial/replicates/plots?trialId=${trialid}`)
    .then(response => {
      return response.data.data
    })
}

const getPalmInformation = (trialid) => {
  return axiosApiInstance
  .get(`${API_URL}/palm?trialId=${trialid}`)
  .then(response => {
    return response.data.data
  })
}

const editPalmInformation = payload => {
  return axiosApiInstance
    .post(`${API_URL}/plot/editPalmInformation`, payload)
    .then(response => {
      return response.data
    })
}

const attachTrialPlots = (trialid, plots) => {
  return axiosApiInstance
    .post(`${API_URL}/trial/replicates/plots?trialId=${trialid}`, plots)
    .then(response => {
      return response.data
    })
}

const PlotService = {
  getPlotData,
  getQrCodeDataList,
  getTrialPlots,
  getPalmInformation,
  editPalmInformation,
  updatePlot,
  attachTrialPlots
}

export default PlotService
