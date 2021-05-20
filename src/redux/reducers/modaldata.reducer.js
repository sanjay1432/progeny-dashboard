import { MODALDATA_SUCCESS, MODALDATA_FAIL } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

export const ModalDataReducer = (
  state = stateLoader.loadStateByReducer("modalDataReducer"),
  action
) => {
  const { type, payload } = action

  switch (type) {
    case MODALDATA_SUCCESS:
      return {
        ...state,
        result: payload.result
      }
    case MODALDATA_FAIL:
      return {
        ...state,
        result: {}
      }
    default:
      return state
  }
}
