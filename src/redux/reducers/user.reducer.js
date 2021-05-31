import {
  POSITIONLIST_SUCCESS,
  POSITIONLIST_FAIL,
  ADDNEWUSER_SUCCESS,
  ADDNEWUSER_FAIL
} from "../actions/types"

const initialState = {
  result: {}
}

export const PositionListReducer = (state = initialState, action) => {
  switch (action.type) {
    case POSITIONLIST_SUCCESS:
      return {
        ...state,
        result: action.payload
      }
    case POSITIONLIST_FAIL:
      return {
        ...state,
        result: action.payload
      }
    default:
      return {
        state
      }
  }
}
