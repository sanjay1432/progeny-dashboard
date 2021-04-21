import axios from "../api/api"
import { SPC_API_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getKpis = (params, source) => {
  return axios
    .get(
      `${SPC_API_URL}/v1/spc/dashboard/logs/kpis?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getProcesses = (params, source) => {
  return axios
    .get(
      `${SPC_API_URL}/v1/spc/dashboard/logs/processes?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getProcessLines = (params, source) => {
  return axios
    .get(
      `${SPC_API_URL}/v1/spc/dashboard/logs/process-lines?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getPatterns = (params, source) => {
  return axios
    .post(
      `${SPC_API_URL}/v1/spc/dashboard/logs/kpis/patterns`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getKpiEventsByDate = (params, source) => {
  return axios
    .post(
      `${SPC_API_URL}/v1/spc/dashboard/logs/kpis/kpi-events-selected-date`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getCorrelationAnalytics = (params, source) => {
  return axios
    .post(
      `${SPC_API_URL}/v1/spc/dashboard/logs/correlation-analytics`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getScatter = (params, source) => {
  return axios
    .post(
      `${SPC_API_URL}/v1/spc/dashboard/logs/correlation-analytics/scatter-plot`,
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
  getProcesses,
  getProcessLines,
  getPatterns,
  getKpiEventsByDate,
  getKpis,
  getCorrelationAnalytics,
  getScatter
}
