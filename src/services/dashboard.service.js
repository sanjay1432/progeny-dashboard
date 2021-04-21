import axios from "../api/api"
import { API_URL, API_URL_MOCK } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getProductionTotal = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/pulp/dashboard/production/yesterday-production-total?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getTargetProcessLine = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/pulp/dashboard/production/ytd-target-process-line?${ServiceHelper.buildParamsForGET(
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

const getDailyKpiChartData = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/dashboard/production/date-range/daily-kpi-pulp`,
      ServiceHelper.buildParamsForPOST(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getSelectProcessLineData = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/dashboard/production/all-process-lines`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const selectedProcessLines = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/dashboard/production/date-range/selected-process-lines`,
      ServiceHelper.buildParamsForPOST(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getConsumptionKpiData = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/dashboard/consumption/kpi-process-line-data`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getSummary = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/dashboard/summary`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getSummaryByCategory = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/pulp/dashboard/summary/kpiCategories?${ServiceHelper.buildParamsForGET(
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

const getRbSummary = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/power/dashboard/rb-summary?${ServiceHelper.buildParamsForGET(
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

const getPowerKpiSummary = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/power/dashboard/power-kpi-summary?${ServiceHelper.buildParamsForGET(
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

const getRbComparison = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/power/dashboard/rb-comparison`,
      ServiceHelper.buildParamsForPOST(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

export default {
  getProductionTotal,
  getTargetProcessLine,
  getDailyKpiChartData,
  getSelectProcessLineData,
  selectedProcessLines,
  getConsumptionKpiData,
  getSummary,
  getSummaryByCategory,
  getRbSummary,
  getPowerKpiSummary,
  getRbComparison
}
