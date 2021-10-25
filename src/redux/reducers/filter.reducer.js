import { SET_FILTER,SET_RESET, CLEAR_FILTER } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const initialState = stateLoader.loadStateByReducer("filterReducer")

export const FilterReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_FILTER:
      return { filter: payload}

    case CLEAR_FILTER:
      return { filter: ""}
    default:
      return state
  }
}
