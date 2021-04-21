import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, SET_MESSAGE } from "./types"

import AuthService from "../../services/auth.service"

export const login = (username, password) => dispatch => {
  return AuthService.login(username, password).then(
    data => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data }
      })

      return Promise.resolve()
    },
    error => {
      loginErr(error, dispatch)
    }
  )
}

function loginErr(error, dispatch) {
  const message =
    (error.response &&
      error.response.data &&
      error.response.data.ErrorMessage) ||
    error.message ||
    error.toString()

  dispatch({
    type: LOGIN_FAIL
  })

  dispatch({
    type: SET_MESSAGE,
    payload: message
  })
}

export const loginSSO = username => dispatch => {
  return AuthService.loginSSO(username).then(
    data => {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: data.response }
      })

      return Promise.resolve()
    },
    error => {
      if (error.response && error.response.status === 401) {
        loginErr(
          "SSO token is expired, please back to login page to get new token!",
          dispatch
        )
      } else {
        loginErr(error, dispatch)
      }
      return Promise.reject()
    }
  )
}

export const logout = () => dispatch => {
  AuthService.logout()

  dispatch({
    type: LOGOUT
  })
}
