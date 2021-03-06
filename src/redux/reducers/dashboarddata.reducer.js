import { DASHBOARDDATA_FAIL,DASHBOARDDATA_CLEAR, DASHBOARDDATA_SUCCESS } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

export const DashboardDataReducer = (
  state = stateLoader.loadStateByReducer("dashboardDataReducer"),
  action
) => {
  const { type, payload } = action

  switch (type) {
    case DASHBOARDDATA_SUCCESS:
      return {
        ...state,
        result: payload.result
      }
    // case DASHBOARDDATA_FAIL:
    //   return {
    //     ...state,
    //     result: {}
    //   }
    case DASHBOARDDATA_CLEAR:
      return {
        ...state,
        result: {}
      }
    default:
      return state
  }
}
