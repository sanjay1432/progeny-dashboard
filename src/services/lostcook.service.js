import axios from "../api/api"
import { API_LOSTCOOK_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getFiberlineData = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/fiberlineProduct?${ServiceHelper.buildParamsForGET(
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
const getLostcookEventDetails = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/lostcookEventDetails?${ServiceHelper.buildParamsForGET(
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

const getLostcookCumulativeChart = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/lostcookCumulativeChart?${ServiceHelper.buildParamsForGET(
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

const getFiberlineLossWithADT = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/fiberlineLossWithADT?${ServiceHelper.buildParamsForGET(
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

const getTop5 = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/top5?${ServiceHelper.buildParamsForGET(
        params
      )}`,
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

// Textual Analysis -> Timeseries
const getOpenMaintenanceOrder = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/openMaintenanceOrder?${ServiceHelper.buildParamsForGET(
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

const fiberlineList = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/fiberlineList?${ServiceHelper.buildParamsForGET(
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
const shiftList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/shiftList`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const areaList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/areaList`, { cancelToken: source.token })
    .then(response => {
      return response.data
    })
}

const sapStatus = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/sapStatus`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const statusList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/statusList`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const equipmentList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/equipmentList`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const externalAndInternal = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/externalAndInternal`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const responsibilityList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/responsibilityList`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

// Lostcook Analysis -> Histogram Data
const getHistogramData = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/histogramData`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getlcAnalysisPieChart = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/lcAnalysisPieChart`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

// Lostcook Analysis -> Datatable
const getLCAnalysisDataTable = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/lcAnalysisDataTable`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

// Pareto
const paretoChart = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/paretoChart`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

// Textual Analysis -> Datatable
const lcSearchResultTable = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/lcSearchResultTable`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}
// Textual Analysis -> Histogram Area and Responsibility
const getHistogram = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/histogram`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

// Textual Analysis -> Timeseries
const getTimeSeries = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/timeSeries`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

//Edit Target
const getTargetCookAndProductConfig = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/getTargetCookAndProductConfig?${ServiceHelper.buildParamsForGET(
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

const saveTargetCookAndProductConfig = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/saveTargetCookAndProductConfig`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const addNewEquipment = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/addNewEquipment`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const addNewProblem = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/addNewProblem`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getSummaryCookConfig = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/getSummaryCookConfig?${ServiceHelper.buildParamsForGET(
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

const saveSummaryCookConfig = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/saveSummaryCookConfig`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const problemList = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/problemList`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const addNewLostcookItem = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/addNewLostcookItem`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editLostcookItem = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/editLostcookItem`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const deleteLostcookItem = (params, source) => {
  return axios
    .post(
      `${API_LOSTCOOK_URL}/lostcook/deleteLostcookItem`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getEditHistory = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/getEditHistory?${ServiceHelper.buildParamsForGET(
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

const openMaintenanceLcItem = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/openMaintenanceLcItem?${ServiceHelper.buildParamsForGET(
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

const openMaintenanceOrderNO = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/openMaintenanceOrderNO?${ServiceHelper.buildParamsForGET(
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
const openMaintenanceOrderMO = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/openMaintenanceOrderMO?${ServiceHelper.buildParamsForGET(
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

const getLatestDate = source => {
  return axios
    .get(`${API_LOSTCOOK_URL}/lostcook/getLatestDate`, {
      cancelToken: source.token
    })
    .then(response => {
      return response.data
    })
}

const getLossLimit = (params, source) => {
  return axios
    .get(
      `${API_LOSTCOOK_URL}/lostcook/getLossLimit?${ServiceHelper.buildParamsForGET(
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
  getLostcookCumulativeChart,
  getFiberlineData,
  getLostcookEventDetails,
  getFiberlineLossWithADT,
  getTop5,
  getHistogramData,
  getLCAnalysisDataTable,
  getHistogram,
  getTimeSeries,
  responsibilityList,
  areaList,
  fiberlineList,
  getlcAnalysisPieChart,
  paretoChart,
  lcSearchResultTable,
  getOpenMaintenanceOrder,
  getTargetCookAndProductConfig,
  saveTargetCookAndProductConfig,
  getSummaryCookConfig,
  saveSummaryCookConfig,
  problemList,
  addNewLostcookItem,
  getEditHistory,
  openMaintenanceOrderMO,
  openMaintenanceOrderNO,
  openMaintenanceLcItem,
  getLatestDate,
  equipmentList,
  editLostcookItem,
  externalAndInternal,
  getLossLimit,
  statusList,
  shiftList,
  addNewProblem,
  addNewEquipment,
  sapStatus,
  deleteLostcookItem
}
