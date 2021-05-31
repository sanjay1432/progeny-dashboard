import {
  POSITIONLIST_SUCCESS,
  POSITIONLIST_FAIL,
  ADDNEWUSER_SUCCESS,
  ADDNEWUSER_FAIL
} from "./types"
import axios from "axios"
import UserService from "../../services/user.service"

export const getPositionList = () => dispatch => {
  return UserService.getPositionList()
    .then(response => {
      dispatch({
        type: POSITIONLIST_SUCCESS,
        payload: response.data
      })
      return Promise.resolve()
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
