import {
  SET_MILL,
  SET_BREADCRUMB,
  SET_MILLS,
  SET_BU,
  SET_EXPAND_CHART
} from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const AppReducer = (
  state = stateLoader.loadStateByReducer("appReducer"),
  action
) => {
  switch (action.type) {
    case SET_BU:
      return {
        ...state,
        buId: action.buId
      }
    case SET_MILL:
      return {
        ...state,
        mill: action.mill
      }
    case SET_MILLS:
      return {
        ...state,
        mills: action.mills
      }
    case SET_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.breadcrumb
      }
    case SET_EXPAND_CHART:
      return {
        ...state,
        expandChart: action.expandChart
      }
    default:
      return state
  }
}

export default AppReducer
