import { API_URL } from "../constants"
import axiosApiInstance from "../api/api"

const getQrCodeDataList = trialid => {
  return axiosApiInstance.get(`${API_URL}/plot/qrcode/001`).then(response => {
    return response.data
  })
}

export default {
  getQrCodeDataList
}
