import {
  SET_MILL,
  SET_BREADCRUMB,
  SET_MILLS,
  SET_BU,
  SET_EXPAND_CHART
} from "./types"

export const setBU = buId => ({
  type: SET_BU,
  buId
})

export const setMill = mill => ({
  type: SET_MILL,
  mill
})

export const setMills = mills => ({
  type: SET_MILLS,
  mills
})

export const setBreadcrumb = breadcrumb => ({
  type: SET_BREADCRUMB,
  breadcrumb
})

export const setExpandChart = expandChart => ({
  type: SET_EXPAND_CHART,
  expandChart
})
