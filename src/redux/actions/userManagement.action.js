import { POSITIONLIST_SUCCESS, POSITIONLIST_FAIL } from "./types"
import axios from "axios"

export const getPosition = () => {
  return dispatch => {
    axios
      .get("http://localhost:8000/api/v1/general/master-data/user-position")
      .then(response => {
        const result = response.data
        dispatch(getPositionSuccess(result))
      })
      .catch(error => {
        const errorMsg = error.message
        dispatch(getPositionFail(errorMsg))
      })
  }
}

export const getPositionSuccess = result => {
  return {
    type: POSITIONLIST_SUCCESS,
    payload: result
  }
}

const getPositionFail = errorMsg => {
  return {
    type: POSITIONLIST_FAIL,
    payload: errorMsg
  }
}
