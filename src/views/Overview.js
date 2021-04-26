import React, { useState, useEffect } from "react"
import { CANCEL_REQUEST, FREQUENCY_SELECT_OPTS } from "../constants"
import MenuRoundedIcon from "@material-ui/icons/MenuRounded"
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
  InputPicker,
  Sidenav,
  FlexboxGrid
} from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "../redux/actions/app.action"
import axios from "axios"
import BreadcrumbProgeny from "../components/nav/BreadcrumbProgeny"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"
import { Link } from "react-router-dom"
import { set } from "lodash"
import Estate from "./Estate"

const headerStyles = {
  padding: 0,
  height: 60,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden"
}

const navigationStyles = {
  padding: 17,
  height: 60,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden"
}

const Overview = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isActive, setIsActive] = useState(true)
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

  const NavigationBar = ({ action, onSelect, ...props }) => {
    function handleChange() {
      if (isActive) {
        setIsActive(false)
      } else {
        setIsActive(true)
      }
    }

    return (
      <NavRS appearance="subtle" {...props} onClick={handleChange}>
        <NavRS.Item eventKey="estate" active={isActive}>
          Estate
        </NavRS.Item>
        <NavRS.Item eventKey="trial">Trial and Replicate</NavRS.Item>
        <NavRS.Item eventKey="plot">Plot</NavRS.Item>
        <NavRS.Item eventKey="palm">Palm</NavRS.Item>
        <NavRS.Item eventKey="progeny">Progeny</NavRS.Item>
      </NavRS>
    )
  }

  return (
    <>
      {isLoggedIn && (
        <div className="sidebar-page">
          <div style={headerStyles}>
            <Navbar.Header>
              <MenuRoundedIcon />
              <img alt="RGE" height={40} src={logo} />
            </Navbar.Header>
          </div>
          <ContainerRS>
            <ContainerRS>
              <Header>
                <Navbar className="custom-navs">
                  <Navbar.Body>
                    <NavigationBar />
                  </Navbar.Body>
                </Navbar>
              </Header>
              <Content>
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
                <main>
                  <section id="overview" className="main-section">
                    {isLoading ? (
                      <Loader center content="Loading" />
                    ) : (
                      <Container fluid>
                        <Row className="justify-content-center">
                          <Estate />
                          {/* MAIN COMPOENTS */}
                        </Row>
                      </Container>
                    )}
                  </section>
                </main>
                <NavRS pullRight></NavRS>
              </Content>
            </ContainerRS>
          </ContainerRS>
        </div>
      )}
    </>
  )
}
export default Overview
