import { SET_TRIAL, CLEAR_TRIAL } from "../actions/types"

const initialState = {}

export const TrialReducer = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case SET_TRIAL:
      return { trial: payload }

    case CLEAR_TRIAL:
      return { trial: "" }

    default:
      return state
  }
}
