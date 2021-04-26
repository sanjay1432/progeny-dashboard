import React, { useState, useEffect } from "react"
import { CANCEL_REQUEST, FREQUENCY_SELECT_OPTS } from "../constants"
import classnames from "classnames"
import logo from "assets/img/PG-logo/asianagri_dpp-h.svg"
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
import ProgenySubNavBar from "../components/nav/ProgenySubNavBar"
import TabPanel from "../components/shared/TabPanel"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"
import { Drawer, Button, IconButton, Sidenav } from "rsuite"

const headerStyles = {
  padding: 8,
  paddingLeft: 16,
  height: 56,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden"
}

const initialSidenavState = {
  expanded: true,
  activeKey: "1"
}
const initialSubnavState = {
  active: "estate"
}
const listItems = [
  {
    name: "Master Data",
    icon: "dashboard",
    eventKey: "1",
    sublist: [
      {
        name: "Estate",
        eventKey: "estate"
      },
      {
        name: "Trial and Replicate",
        eventKey: "trial"
      },
      {
        name: "Plot",
        eventKey: "plot"
      },
      {
        name: "Palm",
        eventKey: "palm"
      },
      {
        name: "Progeny",
        eventKey: "progeny"
      }
    ]
  },
  {
    name: "User Management",
    icon: "group",
    eventKey: "2",
    sublist: [
      {
        name: "Estate Assignment",
        eventKey: "estate"
      },
      {
        name: "User Assignment",
        eventKey: "user"
      }
    ]
  }
]

const Overview = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawer, setDrawer] = useState(false)
  const [sidenavState, setSidenavState] = useState(initialSidenavState)
  const [subnavState, setSubnavState] = useState(initialSubnavState)
  const dispatch = useDispatch()
  const { isLoggedIn, user } = useSelector(state => state.authReducer)
  const history = useHistory()
  const currentSideItem = listItems.find(
    item => item.eventKey === sidenavState.activeKey
  )
  console.log({ currentSideItem }, sidenavState)
  const toggleNavs = (e, index) => {
    e.preventDefault()
    setActiveTab(index)
  }
  function toggleDrawer() {
    setDrawer(true)
  }
  function handleSelectTab(eventKey) {
    setSidenavState(() => ({ ...sidenavState, activeKey: eventKey }))
    close()
  }
  function handleSelect(activeKey) {
    setSubnavState(() => ({ ...subnavState, active: activeKey }))
  }
  function close() {
    setDrawer(false)
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
  const { activeKey, expanded } = sidenavState
  const { active } = subnavState
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
                      <IconButton
                        icon={<Icon icon="angle-right" />}
                        onClick={() => toggleDrawer()}
                      >
                        Left
                      </IconButton>
                    </div>
                  </Navbar.Header>

                  <Navbar.Header>
                    <div style={headerStyles}>
                      <img alt="RGE" height={40} src={logo} />
                    </div>
                  </Navbar.Header>
                  <Navbar.Body>
                    {/* <NavRS>
                      <BreadcrumbProgeny />
                    </NavRS> */}
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
                  <ProgenySubNavBar
                    active={active}
                    onSelect={handleSelect}
                    currentItem={currentSideItem}
                  />
                  <section id="overview" className="main-section">
                    {isLoading ? (
                      <Loader center content="Loading" />
                    ) : (
                      <Container fluid>
                        <Row className="justify-content-center">
                          {/* MAIN COMPOENTS */}
                          <TabPanel currentSubNavState={subnavState} />
                        </Row>
                      </Container>
                    )}
                  </section>
                </main>
              </Content>
              <Drawer
                size="xs"
                placement="left"
                backdrop
                show={isDrawer}
                onHide={close}
              >
                <Drawer.Header>
                  <Drawer.Title>Progeny Management System</Drawer.Title>
                </Drawer.Header>
                <Drawer.Body style={{ margin: "30px 0px" }}>
                  <Sidenav
                    expanded={expanded}
                    activeKey={activeKey}
                    onSelect={handleSelectTab}
                  >
                    <Sidenav.Body>
                      <NavRS>
                        {listItems.map((item, i) => (
                          <NavRS.Item
                            eventKey={item.eventKey}
                            icon={<Icon icon={item.icon} key={i} />}
                          >
                            {item.name}
                          </NavRS.Item>
                        ))}
                      </NavRS>
                    </Sidenav.Body>
                  </Sidenav>
                </Drawer.Body>
              </Drawer>
            </ContainerRS>
          </ContainerRS>
        </div>
      )}
    </>
  )
}
export default Overview
