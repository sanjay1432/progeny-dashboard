import axios from "../api/api"
import { API_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getProductionTargetConfig = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/threshold-mngmt/production-targets?${ServiceHelper.buildParamsForGET(
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

const addProductionTargetConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/production-targets`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editProductionTargetConfig = (params, source) => {
  return axios
    .put(
      `${API_URL}/v1/general/threshold-mngmt/production-targets`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const deleteProductionTargetConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/delete-production-targets`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const getProcessLineConfig = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/threshold-mngmt/process-line-targets?${ServiceHelper.buildParamsForGET(
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

const addProcessLineConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/process-line-targets`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editProcessLineConfig = (params, source) => {
  return axios
    .put(
      `${API_URL}/v1/general/threshold-mngmt/process-line-targets`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const deleteProcessLineConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/delete-process-line-targets`,
      ServiceHelper.buildParamsForPOST(params),
      { cancelToken: source.token }
    )
    .then(response => {
      return response.data
    })
}

const getAnnualConfig = (params, source) => {
  return axios
    .get(
      `${API_URL}/v1/general/threshold-mngmt/annual-config?${ServiceHelper.buildParamsForGET(
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

const addAnnualConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/annual-config`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editAnnualConfig = (params, source) => {
  return axios
    .put(
      `${API_URL}/v1/general/threshold-mngmt/annual-config`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const deleteAnnualConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/delete-annual-config`,
      ServiceHelper.buildParamsForPOST(params),
      {
        cancelToken: source.token
      }
    )
    .then(response => {
      return response.data
    })
}

const editBPIConfig = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/general/threshold-mngmt/update-kpi-bpi`,
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
  getProductionTargetConfig,
  addProductionTargetConfig,
  editProductionTargetConfig,
  deleteProductionTargetConfig,
  getProcessLineConfig,
  addProcessLineConfig,
  editProcessLineConfig,
  deleteProcessLineConfig,
  getAnnualConfig,
  addAnnualConfig,
  editAnnualConfig,
  deleteAnnualConfig,
  editBPIConfig
}
