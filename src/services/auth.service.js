import axios from "axios"
import {
  API_URL,
  REFRESH_TOKEN_NAME,
  SSO_WEB_LOGIN,
  TOKEN_NAME,
  API_TOKEN
} from "../constants"
import StateLoader from "../redux/StateLoader"
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const stateLoader = new StateLoader()

// const login = (username, password) => {
//   return axios
//     .post(`${API_URL}/v1/general/login/user-login`, {
//       username,
//       password
//     })
//     .then(response => {
//       if (response.data.token) {
//         localStorage.setItem("user", JSON.stringify(response.data))
//         localStorage.setItem(TOKEN_NAME, response.data.token)
//       }
//       return response.data
//     })
// }
const login = (username, password) =>
  new Promise((resolve, reject) => {
    if (username && password) {
      var hash = bcrypt.hashSync(password, salt);
      return axios
    .get(`${SSO_WEB_LOGIN}/account/login?username=${username}&password=${hash}`)
    .then(response => {
      if (response.data.response) {
        localStorage.setItem("user", JSON.stringify(response.data.response))
        localStorage.setItem(TOKEN_NAME, response.data.response.token)
        resolve(response.data.response)
      }}) 
    } else {
      reject()
    }
  })
// const loginSSO = ssoToken => {
//   return axios
//     .post(`${API_URL}/v1/general/login/sso-login`, {
//       ssoToken: ssoToken
//     })
//     .then(response => {
//       if (response.data.response) {
//         localStorage.setItem("user", JSON.stringify(response.data.response))
//         localStorage.setItem(TOKEN_NAME, response.data.response.token)
//         localStorage.setItem(
//           REFRESH_TOKEN_NAME,
//           response.data.response.refresh_token
//         )
//       }
//       return response.data
//     })
// }

const refreshToken = () => {
  const refresh_token = localStorage.getItem(REFRESH_TOKEN_NAME)
  return axios
    .get(`${API_URL}/v1/general/login/refresh`, {
      headers: { refreshToken: refresh_token }
    })
    .then(response => {
      return response.data
    })
}
const logout = () => {
  localStorage.clear()
  stateLoader.initializeState()
}

const AuthService = {
  login,
  logout,
  // loginSSO,
  refreshToken
}

export default AuthService
