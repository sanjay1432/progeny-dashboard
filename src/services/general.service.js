import axios from "../api/api"
import { API_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getKpis = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/kpi-category/kpis`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getAllProcessLines = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/mill-details/all-process-lines?${ServiceHelper.buildParamsForGET(
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

const getLatestDate = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/mill-details/latest-date?${ServiceHelper.buildParamsForGET(
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

const getKpiProcessLineByKpiCategory = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/pulp/overview/kpi-process-line-data?${ServiceHelper.buildParamsForGET(
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

const annotationDates = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/kpi/annotation-dates`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getAnnotation = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/kpi/annotation?${ServiceHelper.buildParamsForGET(
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

const addAnnotation = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/kpi/annotation`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editAnnotation = (params, source) => {
  return axios
    .put(
      `${API_URL}/v1/general/kpi/annotation`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const GeneralService = {
  getLatestDate,
  getAllProcessLines,
  getKpis,
  getKpiProcessLineByKpiCategory,
  annotationDates,
  getAnnotation,
  addAnnotation,
  editAnnotation
}
export default GeneralService
