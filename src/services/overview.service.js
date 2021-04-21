import axios from "../api/api"
import { API_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getAllBuMills = source => {
  return axios
    .get(`${API_URL}/v1/general/mill-details/all-bu-mills`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const getProductionChart = (params, source) => {
  return axios
    .post(`${API_URL}/v1/pulp/overview/production-gauge-chart`, params, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const getAllMillLatestDate = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/pulp/overview/all-mills-latest-date?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

export default {
  getAllBuMills,
  getProductionChart,
  getAllMillLatestDate
}
