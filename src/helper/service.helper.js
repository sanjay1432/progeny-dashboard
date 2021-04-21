import moment from "moment"
import { TIME_SELECT_OPTS, TOKEN_NAME } from "../constants"

const buildParamsForGET = params => {
  return new URLSearchParams(buildParams(params)).toString()
}

const buildParamsForPOST = params => {
  return buildParams(params)
}

const buildParams = params => {
  if (params.displayAsDate) {
    params.displayAsDate = moment(params.displayAsDate).format()
    if (params.startDate) {
      switch (params.startDate) {
        case TIME_SELECT_OPTS[0].value:
          params.endDate = params.displayAsDate
          params.startDate = moment(params.displayAsDate)
            .subtract(1, "months")
            .format()
          break
        case TIME_SELECT_OPTS[1].value:
          params.endDate = params.displayAsDate
          params.startDate = moment(params.displayAsDate)
            .subtract(3, "months")
            .format()
          break
        case TIME_SELECT_OPTS[2].value:
          params.endDate = params.displayAsDate
          params.startDate = moment(params.displayAsDate)
            .subtract(6, "months")
            .format()
          break
        default:
          break
      }
    }
  }
  if (params.dateRange && params.dateRange.length === 2) {
    params.startDate = moment(params.dateRange[0]).format()
    params.endDate = moment(params.dateRange[1]).format()
    delete params.dateRange
  }
  if (params.selectedDate) {
    params.selectedDate = moment(params.selectedDate).format()
  }
  if (params.startDateTime) {
    params.startDateTime = moment(params.startDateTime).format()
  }
  if (params.endDateTime) {
    params.endDateTime = moment(params.endDateTime).format()
  }
  if (params.dueDate) {
    params.dueDate = moment(params.dueDate).format()
  }
  if (params.recordDate) {
    params.recordDate = moment(params.recordDate).format()
  }
  if (params.startDate) {
    params.startDate = moment(params.startDate).format()
  }
  if (params.endDate) {
    params.endDate = moment(params.endDate).format()
  }

  return params
}

const config = (token = localStorage.getItem(TOKEN_NAME)) => {
  return {
    headers: { Authorization: `Bearer ${token}` }
  }
}

export default {
  buildParamsForGET,
  buildParamsForPOST,
  config
}
