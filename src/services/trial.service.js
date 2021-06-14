import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

const saveTrial = payload => {
  return axiosApiInstance.post(`${API_URL}/trial`, payload).then(response => {
    return response.data
  })
}

export default {
  saveTrial
}
