import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import Form from "react-validation/build/form"
import CheckButton from "react-validation/build/button"
import { login } from "../redux/actions/auth.action"
import logo from "assets/img/Progeny-logo/logoStyle02.png"
import { Loader } from "rsuite"
import { useHistory } from "react-router-dom"
// reactstrap components
import { Card, CardBody, Container } from "reactstrap"

const required = value => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    )
  }
}

const LOGIN_METHOD = {
  sso: "sso",
  normal: "normal"
}

const Login = props => {
  const form = useRef()
  const checkBtn = useRef()
  const history = useHistory()

  const [username, setUsername] = useState("")
  const [ssoUsername, setSsoUsername] = useState("")
  const [ssoToken, setSsoToken] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState(null)

  const { isLoggedIn } = useSelector(state => state.authReducer)
  const { message } = useSelector(state => state.messageReducer)

  const dispatch = useDispatch()

  useEffect(() => {
    if (history.location.search) {
      const urlParams = new URLSearchParams(history.location.search)
      const usernameSSO = urlParams.get("username")
      const token = urlParams.get("token")
      if (usernameSSO) {
        setLoginMethod(LOGIN_METHOD.sso)
        setSsoUsername(usernameSSO)
        setSsoToken(token)
      }
    }
  }, [history])

  const onChangeUsername = e => {
    setUsername(e.target.value)
  }

  const onChangePassword = e => {
    setPassword(e.target.value)
  }

  const handleLogin = e => {
    e.preventDefault()

    setLoading(true)

    form.current.validateAll()

    if (checkBtn.current.context._errors.length === 0) {
      dispatch(login(username, password))
        .then(() => {
          // props.history.push("/overview")
          props.history.push("/overview")
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }

  if (isLoggedIn) {
    return <Redirect to="/overview" />
  }

  // const backToLogin = () => {
  //   setLoginMethod(null)
  //   setSsoUsername("")
  //   setSsoToken("")
  // }

  return (
    <>
      <main>
        <section id="login">
          <Container>
            <Card className="bg-transparent border-0">
              <CardBody>
                <div className="text-center">
                  <img
                    src={logo}
                    alt="Progeny Management System"
                    height={200}
                  />
                  <p className="title">
                    Login to <b>Progeny Management System</b> Dashboard
                  </p>
                </div>
                <Form onSubmit={handleLogin} ref={form}>
                  <tr>
                    <td>
                      <label className="login-label">Username</label>
                    </td>
                    <td>
                      <input
                        className="form-login"
                        name="username"
                        type="text"
                        placeholder="Username"
                        onChange={onChangeUsername}
                        value={username}
                        validations={[required]}
                      />
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <label className="login-label">Username</label>
                    </td>
                    <td>
                      <input
                        className="form-login"
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={onChangePassword}
                        validations={[required]}
                      />
                    </td>
                  </tr>

                  <div className="form-group">
                    <button
                      className="btn btn-primary btn-block btn-lg login"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm" />
                      )}
                      <span>Login</span>
                    </button>
                  </div>

                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>
                {/* )} */}
              </CardBody>
            </Card>
            <p>
              {loading && (
                <Loader
                  backdrop
                  size="lg"
                  center
                  content="SSO Authentication Loading..."
                />
              )}
            </p>
          </Container>
          <p className="footer-text">
            2021 Ace Resource Advisory Services Sdn. Bhd.
          </p>
        </section>
      </main>
    </>
  )
}

export default Login
