import { POSITIONLIST_SUCCESS, POSITIONLIST_FAIL } from "./types"
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
      })
    })
}
