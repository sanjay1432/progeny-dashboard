import { SET_RESET, CLEAR_RESET } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()
const initialState = {}

export const ResetReducer = (  state = stateLoader.loadStateByReducer("resetReducer"), action) => {
  const { type } = action

  switch (type) {
    case SET_RESET:
      return true

    case CLEAR_RESET:
      return false

    default:
      return state
  }
}
