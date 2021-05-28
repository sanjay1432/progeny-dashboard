import {
  POSITIONLIST_SUCCESS,
  POSITIONLIST_FAIL,
  ADDNEWUSER_SUCCESS,
  ADDNEWUSER_FAIL
} from "./types"
import axios from "axios"

export const getPosition = () => {
  return dispatch => {
    axios
      .get("http://localhost:8000/api/v1/general/master-data/user-position")
      .then(response => {
        return response.data
        //const result = response.data
        //dispatch(getPositionSuccess(result))
      })
      .then(data => {
        dispatch({
          type: POSITIONLIST_SUCCESS,
          payload: data
        })
      })
      .catch(error => {
        dispatch({
          type: POSITIONLIST_FAIL,
          payload: error.message
          //const errorMsg = error.message
          //dispatch(getPositionFail(errorMsg))
        })
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

export const addNewUser = () => {
  return dispatch => {
    axios
      .post(
        "https://www.w3schools.com/react/react_props.asp#:~:text=Props%20are%20arguments%20passed%20into,to%20components%20via%20HTML%20attributes."
      )
      .then(data => {
        dispatch({
          type: ADDNEWUSER_SUCCESS,
          response: data
        })
      })
      .catch(error => {
        dispatch({
          type: ADDNEWUSER_FAIL,
          response: error.message
        })
      })
  }
}
