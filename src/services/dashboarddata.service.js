import axios from "axios"
import { API_URL } from "../constants"
import StateLoader from "../redux/StateLoader"
import axiosApiInstance from "../api/api"
const stateLoader = new StateLoader()

const getDashboardData = type => {
  return axiosApiInstance
    .get(`${API_URL}/v1/general/master-data/${type}`)
    .then(response => {
      return response.data
    })
}

export default {
  getDashboardData
}