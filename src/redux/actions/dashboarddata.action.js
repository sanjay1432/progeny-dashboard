import { SET_MESSAGE, DASHBOARDDATA_FAIL, DASHBOARDDATA_CLEAR, DASHBOARDDATA_SUCCESS } from "./types"
import store from "../store"
import DashboardDataService from "../../services/dashboarddata.service"
import PalmService from "../../services/palm.service"
export const getDashboardData = type => dispatch => {
  return DashboardDataService.getDashboardData(type).then(
    response => {
      const { data } = response
      const { result } = store.getState().dashboardDataReducer
      result[type] = data
      dispatch({
        type: DASHBOARDDATA_SUCCESS,
        payload: { result }
      })
      return Promise.resolve()
    },
    error => {
      getErr(error, dispatch)
    }
  )
}
export const getPalmData = (payload) => dispatch => {
  return PalmService.getPalmData(payload).then(
    response => {
      const { data } = response
      const { result } = store.getState().dashboardDataReducer
      result['palm'] = data
      dispatch({
        type: DASHBOARDDATA_SUCCESS,
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
  const message =
    (error.response &&
      error.response.data &&
      error.response.data.ErrorMessage) ||
    error.message ||
    error.toString()

  dispatch({
    type: DASHBOARDDATA_FAIL
  })

  dispatch({
    type: SET_MESSAGE,
    payload: message
  })
}

export const clearDashboardData = () => ({
  type: DASHBOARDDATA_CLEAR
})