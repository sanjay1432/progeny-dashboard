import axios from "axios"
import { TOKEN_NAME, REFRESH_TOKEN_NAME } from "../constants"
import AuthService from "../services/auth.service"
import { Alert } from "rsuite"

const axiosApiInstance = axios.create()

axiosApiInstance.interceptors.request.use(
  async config => {
    const token = localStorage.getItem(TOKEN_NAME)
    config.headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// Response interceptor for API calls
axiosApiInstance.interceptors.response.use(
  response => {
    return response
  },
  async function (error) {
    const originalRequest = error.config
    if (
      error &&
      error.response &&
      error.response.data &&
      error.response.data.message &&
      error.response.status >= 400 &&
      error.response.status < 500
    ) {
      console.log("Error detail", error)
      error.message = error.response.data.message
    } else {
      if (
        error &&
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true
        const response = await refreshAccessToken()
        if (
          response.response &&
          response.response.access_token &&
          response.response.refresh_token
        ) {
          localStorage.setItem(TOKEN_NAME, response.response.access_token)
          localStorage.setItem(
            REFRESH_TOKEN_NAME,
            response.response.refresh_token
          )
          originalRequest.headers["Authorization"] =
            "Bearer " + response.response.access_token
        } else {
          localStorage.clear()
          Alert.closeAll()
          Alert.error("Session is expired,Please login again .", 7000)
          setTimeout(() => {
            window.location.reload()
          }, 7000)
        }
        return axiosApiInstance(originalRequest)
      }
    }

    return Promise.reject(error)
  }
)

const refreshAccessToken = () => {
  return AuthService.refreshToken()
}
export default axiosApiInstance
