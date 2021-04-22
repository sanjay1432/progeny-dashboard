import React, { useState, useEffect } from "react"
import { CANCEL_REQUEST, FREQUENCY_SELECT_OPTS } from "../constants"
import classnames from "classnames"
import logo from "assets/img/RGE-logo/dmp-square.svg"
// reactstrap components
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  TabContent,
  TabPane,
  NavLink,
  NavItem,
  Nav
} from "reactstrap"

import {
  Loader,
  Alert,
  Header,
  Navbar,
  Icon,
  Content,
  Nav as NavRS,
  Container as ContainerRS,
  Dropdown,
  InputPicker
} from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "../redux/actions/app.action"
import axios from "axios"
import BreadcrumbProgeny from "../components/nav/BreadcrumbProgeny"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"

const headerStyles = {
  padding: 8,
  paddingLeft: 16,
  height: 56,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden"
}

const Overview = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const { isLoggedIn, user } = useSelector(state => state.authReducer)
  const history = useHistory()
  const toggleNavs = (e, index) => {
    e.preventDefault()
    setActiveTab(index)
  }

  useEffect(() => {
    if (!isLoggedIn) {
      history.push({
        pathname: "/login"
      })
    } else {
      dispatch(setBreadcrumb(["Progeny", "Overview"]))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()

      const fetchData = async () => {
        setIsLoading(false)
      }

      fetchData()
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [dispatch, history, isLoggedIn, props.location.state, user])

  if (isLoading) {
    return <Loader center content="Loading" />
  }
  return (
    <>
      {isLoggedIn && (
        <div className="sidebar-page">
          <ContainerRS>
            <ContainerRS>
              <Header>
                <Navbar className="custom-navs">
                  <Navbar.Header>
                    <div style={headerStyles}>
                      <img alt="RGE" height={40} src={logo} />
                    </div>
                  </Navbar.Header>
                  <Navbar.Body>
                    <NavRS>
                      <BreadcrumbProgeny />
                    </NavRS>
                    <NavRS pullRight>
                      <Dropdown
                        icon={<Icon icon="user-o" />}
                        title={GeneralHelper.buildDisplayName(
                          user.firstName,
                          user.lastName,
                          user.username
                        )}
                      >
                        <Dropdown.Item
                          icon={<Icon icon="sign-out" />}
                          onClick={() => dispatch(logout())}
                        >
                          Logout
                        </Dropdown.Item>
                      </Dropdown>
                    </NavRS>
                  </Navbar.Body>
                </Navbar>
              </Header>
              <Content>
                <main>
                  <section id="overview" className="main-section">
                    {isLoading ? (
                      <Loader center content="Loading" />
                    ) : (
                      <Container fluid>
                        <Row className="justify-content-center">
                          <h1>MyTable</h1>
                          {/* MAIN COMPOENTS */}
                        </Row>
                      </Container>
                    )}
                  </section>
                </main>
              </Content>
            </ContainerRS>
          </ContainerRS>
        </div>
      )}
    </>
  )
}
export default Overview
