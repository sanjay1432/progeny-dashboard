import { API_URL } from "../constants"
import axiosApiInstance from "api/api"

const addNewProgeny = payload => {
  return axiosApiInstance(`${API_URL}/progeny`, payload).then(response => {
    return response.data
  })
}

export default {
  addNewProgeny
}
