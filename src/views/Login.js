import React, { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import classnames from "classnames"
import Form from "react-validation/build/form"
import CheckButton from "react-validation/build/button"

import { login, loginSSO } from "../redux/actions/auth.action"
import logo from "assets/img/RGE-logo/dmp-square.svg"
import { IconButton, Icon, Loader } from "rsuite"
import { useHistory } from "react-router-dom"
import { SSO_WEB_LOGIN } from "../constants/index"
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

  const selectSSOLogin = () => {
    setLoading(true)
    window.location.replace(SSO_WEB_LOGIN)
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

  const ssoLogin = e => {
    e.preventDefault()
    setLoading(true)
    dispatch(loginSSO(ssoToken))
      .then(() => {
        // props.history.push("/overview")
        props.history.push("/overview")
      })
      .catch(() => {
        setLoading(false)
      })
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
                <div className="text-center login-logo">
                  <img src={logo} alt="RGE Group" height={100} />
                  <h2>Login to Progeny Dashboard</h2>
                </div>
                {/* {loginMethod === null && (
                  <>
                    <div className="login-method">
                      <IconButton
                        onClick={() => selectSSOLogin()}
                        icon={<Icon icon="angle-right" />}
                        placement="right"
                        block
                      >
                        <span>Single Sign-On (SSO)</span>
                      </IconButton>
                    </div>
                  </>
                )} */}
                {/* {loginMethod === LOGIN_METHOD.sso && (
                  <div>
                    {message && (
                      <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                          {message}
                        </div>
                      </div>
                    )}
                    <div className="custom-input">
                      <input
                        name="username"
                        type="text"
                        placeholder="Username"
                        disabled={true}
                        value={ssoUsername}
                      />
                      <label htmlFor="username">Username</label>
                    </div>
                    <button
                      onClick={e => ssoLogin(e)}
                      className="btn btn-primary btn-block btn-lg login"
                      disabled={loading || ssoUsername === ""}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm" />
                      )}
                      <span>SSO Login</span>
                    </button>
                  </div>
                )} */}
                {/* {loginMethod === LOGIN_METHOD.normal && ( */}
                <Form onSubmit={handleLogin} ref={form}>
                  <div className="custom-input">
                    <input
                      name="username"
                      type="text"
                      placeholder="Username"
                      onChange={onChangeUsername}
                      value={username}
                      validations={[required]}
                    />
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="custom-input">
                    <input
                      name="password"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={onChangePassword}
                      validations={[required]}
                    />
                    <label htmlFor="Password">Password</label>
                  </div>

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
