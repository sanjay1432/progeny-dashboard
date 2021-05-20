import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

const getModalData = type => {
  return axiosApiInstance
    .get(`${API_URL}/v1/external-data/modal`)
    .then(response => {
      return response.data
    })
}

export default { getModalData }
