import { SET_MESSAGE, MODALDATA_SUCCESS, MODALDATA_FAIL } from "./types"
import store from "../store"
import ModalDataService from "../../services/modaldata.service"

export const getModalData = type => dispatch => {
  return ModalDataService.getModalData(type).then(
    response => {
      const { data } = response
      console.log("successfully get data")

      const { result } = store.getState().modalDataReducer
      result = data
      dispatch({
        type: MODALDATA_SUCCESS,
        payload: { result }
      })
      return Promise.resolve()
    },
    error => {
      getErr(error, dispatch)
    }
  )
}

function getErr(error, dispatch) {
  console.log("Error")
}
