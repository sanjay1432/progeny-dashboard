import { SET_BREADCRUMB, CLEAR_BREADCRUMB } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const AppReducer = (
  state = stateLoader.loadStateByReducer("appReducer"),
  action
) => {
  switch (action.type) {
    case SET_BREADCRUMB:
      return {
        ...state,
        breadcrumb: action.breadcrumb
      }
    case CLEAR_BREADCRUMB:
      return { breadcrumb: {} }
    default:
      return state
  }
}

export default AppReducer
