import {
  POSITIONLIST_SUCCESS,
  POSITIONLIST_FAIL,
  ADDNEWUSER_SUCCESS,
  ADDNEWUSER_FAIL
} from "../actions/types"

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
        result: action.payload
      }
    default:
      return {
        state
      }
  }
}

export const AddNewUserReducer = (state = { result: {} }, action) => {
  switch (action.type) {
    case ADDNEWUSER_SUCCESS:
      return {
        ...state,
        result: action.response
      }
    case ADDNEWUSER_FAIL:
      return {
        ...state,
        result: action.response
      }
    default:
      return {
        state
      }
  }
}
