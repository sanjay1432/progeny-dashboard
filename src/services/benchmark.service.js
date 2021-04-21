import axios from "../api/api"
import { API_URL } from "../constants"
import ServiceHelper from "../helper/service.helper"

const getKPI = (params, source) => {
  return axios
    .post(
      `${API_URL}/v1/pulp/benchmark/selected-data`,
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
  getKPI
}
