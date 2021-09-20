import React, { useState, useRef, useCallback, useEffect  } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Redirect } from "react-router-dom"
import Form from "react-validation/build/form"
import CheckButton from "react-validation/build/button"
import { login } from "../redux/actions/auth.action"
import logo from "../assets/img/Progeny-logo/logoStyle02.png"
import { Loader, Input, Grid, Row, Col, Button } from "rsuite"
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
const Login = props => {
  const form = useRef()
  const checkBtn = useRef()
  const [username, setUsername] = useState("")

  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const { isLoggedIn } = useSelector(state => state.authReducer)
  const { message } = useSelector(state => state.messageReducer)
 
  const dispatch = useDispatch()


  useEffect(() => {
    localStorage.clear()
  },[])
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

  return (
    <>
      <main>
        <section id="LoginPage">
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
                    Login to{" "}
                    <b className="titleName">Progeny Management System</b>{" "}
                    Dashboard
                  </p>
                </div>
                <Form className="loginForm" onSubmit={handleLogin} ref={form}>
                  <Grid fluid>
                    <Row className="formLayout">
                      <Col mdOffset={6} md={3} lg={3}>
                        <label className="labelForm">Username</label>
                      </Col>
                      <Col md={8}>
                        <Input
                          className="inputForm"
                          name="username"
                          type="text"
                          placeholder="Username"
                          onChange={(value, e) => onChangeUsername(e)}
                          value={username}
                          validations={[required]}
                        />
                      </Col>
                    </Row>
                    <Row className="formLayout">
                      <Col mdOffset={6} md={3}>
                        <label className="labelForm">Password</label>
                      </Col>
                      <Col md={8}>
                        <Input
                          className="inputForm"
                          name="password"
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={(value, e) => onChangePassword(e)}
                          validations={[required]}
                        />
                      </Col>
                    </Row>

                    <button className="loginButton" disabled={loading}>
                      {loading && (
                        <span className="spinner-border spinner-border-sm" />
                      )}
                      <span>Login</span>
                    </button>
                   
                  </Grid>

                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                  <CheckButton style={{ display: "none" }} ref={checkBtn} />
                </Form>

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
          <p className="companyName">
            2021 Ace Resource Advisory Services Sdn. Bhd.
          </p>
        </section>
      </main>
    </>
  )
}

export default Login
