import { POSITIONLIST_SUCCESS, POSITIONLIST_FAIL } from "../actions/types"

export const PositionReducer = (state = { result: {} }, action) => {
  switch (action.type) {
    case POSITIONLIST_SUCCESS:
      return {
        ...state,
        result: action.payload
      }
    case POSITIONLIST_FAIL:
      return {
        ...state,
        result: {}
      }
    default:
      return {
        state,
        result: "PositionReducer default"
      }
  }
}
