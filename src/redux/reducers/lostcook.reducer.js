import {
  SET_FIBER_LINE,
  SET_LC_ANALYSIS_FILTERED_TABLE,
  SET_LC_ANALYSIS_TABLE,
  SET_SELECTED_DATE_ON_BAR_CHART,
  SET_SELECTED_TYPE_ON_PIE_CHART
} from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const LostcookReducer = (
  state = stateLoader.loadStateByReducer("lostcookReducer"),
  action
) => {
  switch (action.type) {
    case SET_FIBER_LINE:
      return {
        ...state,
        fiberlines: action.fiberlines
      }
    case SET_LC_ANALYSIS_FILTERED_TABLE:
      return {
        ...state,
        lcAnalysisFilteredTable: action.lcAnalysisFilteredTable
      }
    case SET_LC_ANALYSIS_TABLE:
      return {
        ...state,
        lcAnalysisTable: action.lcAnalysisTable
      }
    case SET_SELECTED_DATE_ON_BAR_CHART:
      return {
        ...state,
        selectedDateOnBarChart: action.selectedDateOnBarChart
      }
    case SET_SELECTED_TYPE_ON_PIE_CHART:
      return {
        ...state,
        selectedTypeOnPieChart: action.selectedTypeOnPieChart
      }
    default:
      return state
  }
}

export default LostcookReducer
