import {
  SET_FIBER_LINE,
  SET_LC_ANALYSIS_FILTERED_TABLE,
  SET_LC_ANALYSIS_TABLE,
  SET_SELECTED_DATE_ON_BAR_CHART,
  SET_SELECTED_TYPE_ON_PIE_CHART
} from "./types"

export const setFiberlines = fiberlines => ({
  type: SET_FIBER_LINE,
  fiberlines
})

export const setLCAnalysisFilteredTable = lcAnalysisFilteredTable => ({
  type: SET_LC_ANALYSIS_FILTERED_TABLE,
  lcAnalysisFilteredTable
})

export const setLCAnalysisTable = lcAnalysisTable => ({
  type: SET_LC_ANALYSIS_TABLE,
  lcAnalysisTable
})

export const setSelectedDateOnBarChart = selectedDateOnBarChart => ({
  type: SET_SELECTED_DATE_ON_BAR_CHART,
  selectedDateOnBarChart
})

export const setSelectedTypeOnPieChart = selectedTypeOnPieChart => ({
  type: SET_SELECTED_TYPE_ON_PIE_CHART,
  selectedTypeOnPieChart
})
