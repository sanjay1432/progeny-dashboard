import axios from "../api/api"
import { API_URL, API_URL_MOCK } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getProject = (params, source) => {
  return axios
    .post(
      `${API_URL_MOCK}/ci/project/getall`,
      ServiceHelper.buildParamsForGET(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getProjectTypes = (params, source) => {
  return axios
    .post(
      `${API_URL_MOCK}/ci/project/types`,
      ServiceHelper.buildParamsForPOST(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getKPI = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/continuous-improvement/get-selected-data`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getKPIDetail = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/continuous-improvement/get-kpi-details`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

export default {
  getProject,
  getProjectTypes,
  getKPI,
  getKPIDetail
}
