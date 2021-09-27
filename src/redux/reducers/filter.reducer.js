import { SET_FILTER,SET_RESET, CLEAR_FILTER } from "../actions/types"

const initialState = {}

export const FilterReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_FILTER:
      return { filter: payload, reset: false }

    case CLEAR_FILTER:
      return { filter: "", reset: false }
      
    case SET_RESET:
      return { filter: "", reset: true }
    default:
      return state
  }
}
