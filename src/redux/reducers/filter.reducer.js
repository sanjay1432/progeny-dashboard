import { SET_FILTER, CLEAR_FILTER } from "../actions/types"

const initialState = {}

export const FilterReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_FILTER:
      return { filter: payload }

    case CLEAR_FILTER:
      return { filter: "" }

    default:
      return state
  }
}
