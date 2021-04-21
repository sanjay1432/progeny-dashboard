import { LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

export const AuthReducer = (
  state = stateLoader.loadStateByReducer("authReducer"),
  action
) => {
  const { type, payload } = action

  switch (type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        user: payload.user
      }
    case LOGIN_FAIL:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      }
    case LOGOUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null
      }
    default:
      return state
  }
}
