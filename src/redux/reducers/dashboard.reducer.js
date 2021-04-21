import moment from "moment"
import {
  SET_DISPLAY_AS_DATE,
  SET_DISPLAY_PERIODS,
  SET_DISPLAY_PROCESS_LINE,
  SET_LATEST_DATE,
  SET_PROCESS_LINE
} from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const DashboardReducer = (
  state = stateLoader.loadStateByReducer("dashboardReducer"),
  action
) => {
  switch (action.type) {
    case SET_DISPLAY_PROCESS_LINE:
      return {
        ...state,
        displayProcessLine: action.displayProcessLine
      }
    case SET_DISPLAY_PERIODS:
      return {
        ...state,
        displayPeriods: action.displayPeriods
      }
    case SET_DISPLAY_AS_DATE:
      return {
        ...state,
        displayAsDate: action.displayAsDate
      }
    case SET_LATEST_DATE:
      return {
        ...state,
        latestDate: action.latestDate
      }
    case SET_PROCESS_LINE:
      return {
        ...state,
        processLines: action.processLines
      }
    default:
      return state
  }
}

export default DashboardReducer
