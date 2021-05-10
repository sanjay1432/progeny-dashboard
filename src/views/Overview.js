import React, { useState, useEffect } from "react"
import { CANCEL_REQUEST, FREQUENCY_SELECT_OPTS } from "../constants"
import MenuRoundedIcon from "@material-ui/icons/MenuRounded"
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded"
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded"
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded"
import logo from "assets/img/Progeny-logo/logoStyle02.png"
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
  FlexboxGrid
} from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "../redux/actions/app.action"
import { getDashboardData } from "../redux/actions/dashboarddata.action"
import axios from "axios"
import BreadcrumbProgeny from "../components/nav/BreadcrumbProgeny"
import ProgenySubNavBar from "../components/nav/ProgenySubNavBar"
import TabPanel from "../components/shared/TabPanel"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"
import { Drawer, Button, IconButton, Sidenav } from "rsuite"

//const scrollCallBack = window.addEventListener

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
    customClass: "master",
    customIcon: ImportantDevicesRoundedIcon,
    icon: "desktop",
    eventKey: "1",
    sublist: [
      {
        name: "Estate",
        eventKey: "estate",
        filters: [
          {
            name: "estate",
            label: "Estate",
            type: "select"
          }
        ],
        search: true
      },
      {
        name: "Trial and Replicate",
        eventKey: "trial",
        filters: [
          {
            name: "trialid",
            label: "Trial Id",
            type: "select"
          },
          {
            name: "planteddate",
            label: "Planted Date (year)",
            type: "select"
          },
          {
            name: "estate",
            label: "Estate",
            type: "select"
          },
          {
            name: "soiltype",
            label: "Soil Type",
            type: "select"
          }
        ],
        search: false
      },
      {
        name: "Plot",
        eventKey: "plot",
        filters: [
          {
            name: "trialid",
            label: "Trial Id",
            type: "select"
          },
          {
            name: "estate",
            label: "Estate",
            type: "select"
          },
          {
            name: "replicate",
            label: "Replicate",
            type: "select"
          }
        ],
        search: false
      },
      {
        name: "Palm",
        eventKey: "palm",
        filters: [
          {
            name: "trialid",
            label: "Trial Id",
            type: "select"
          },
          {
            name: "estate",
            label: "Estate",
            type: "select"
          },
          {
            name: "replicate",
            label: "Replicate",
            type: "select"
          },
          {
            name: "plot",
            label: "Plot",
            type: "select"
          }
        ],
        search: false
      },
      {
        name: "Progeny",
        eventKey: "progeny",
        filters: [
          // {
          //   name:"popvar",
          //   label:"Pop Var",
          //   type: "select"
          // },
          // {
          //   name:"generation",
          //   label:"Generation",
          //   type: "select"
          // },
          // {
          //   name:"crosstype",
          //   label:"Cross Type",
          //   type: "select"
          // },
          // {
          //   name:"fpvar",
          //   label:"FP Var",
          //   type: "select"
          // },
          // {
          //   name:"mpvar",
          //   label:"MP Var",
          //   type: "select"
          // },
          {
            name: "progenyId",
            label: "Progeny ID",
            type: "text"
          },
          {
            name: "progeny",
            label: "Progeny",
            type: "text"
          },
          {
            name: "fp",
            label: "FP",
            type: "text"
          },
          {
            name: "fpfam",
            label: "FP Fam",
            type: "text"
          },
          {
            name: "mp",
            label: "MP",
            type: "text"
          },
          {
            name: "mpfam",
            label: "MP Fam",
            type: "text"
          },

          // {
          //   name:"progenyremark",
          //   label:"Progeny Remark",
          //   type: "text"
          // },
          {
            name: "orlet",
            label: "Orlet",
            type: "text"
          }
        ],
        search: false
      }
    ]
  },
  {
    name: "User Management",
    icon: "group",
    customIcon: SupervisedUserCircleRoundedIcon,
    customClass: "master",
    eventKey: "2",
    sublist: [
      {
        name: "User List",
        eventKey: "userlist",
        filters: [
          {
            name: "position",
            label: "Position",
            type: "select"
          }
        ],
        search: true
      },
      {
        name: "Estate Assignment",
        eventKey: "estate",
        filters: [
          {
            name: "estate",
            label: "Estate",
            type: "select"
          }
        ],
        search: true
      },
      {
        name: "User Assignment",
        eventKey: "user",
        filters: [
          {
            name: "estate",
            label: "Estate",
            type: "select"
          },
          {
            name: "position",
            label: "Position",
            type: "select"
          }
        ],
        search: true
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

  // console.log({ currentSideItem }, sidenavState)
  const toggleNavs = (e, index) => {
    e.preventDefault()
    setActiveTab(index)
  }
  function toggleDrawer() {
    setDrawer(true)
  }
  function handleSelectTab(eventKey) {
    setSidenavState(() => ({ ...sidenavState, activeKey: eventKey }))
    if (eventKey === "2") {
      setSubnavState(() => ({ ...subnavState, active: "userlist" }))
    } else {
      setSubnavState(() => ({ ...subnavState, active: "estate" }))
    }

    close()
  }
  function handleSelect(activeKey) {
    console.log({ activeKey })
    dispatch(getDashboardData(activeKey))
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
      const { active } = subnavState
      dispatch(setBreadcrumb(["Progeny", "Overview"]))
      dispatch(getDashboardData(active))
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

  useEffect(() => {
    const header = document.getElementById("Header")
    const sticky = header.OffsetTop
    const scrollCallBack = window.addEventListener("scroll", () => {
      header.classList.add("sticky")
    })
    return () => {
      window.removeEventListener("scroll", scrollCallBack)
    }
  })

  if (isLoading) {
    return <Loader center content="Loading" />
  }
  const { activeKey, expanded } = sidenavState
  const { active } = subnavState
  return (
    <>
      {isLoggedIn && (
        <ContainerRS id="main-page">
          <div id="Header">
            <Header>
              <Navbar className="headNav">
                <Navbar.Header style={{ height: 70 }}>
                  <div className="headNav-left">
                    <MenuRoundedIcon
                      className="headNav-toggle"
                      onClick={() => toggleDrawer()}
                    />
                    <img
                      className="headNav-img"
                      alt="Progeny Management System"
                      src={logo}
                    />

                    <p className="headNav-title">Progeny Management System</p>
                  </div>
                </Navbar.Header>
                <Navbar.Body>
                  {/* <NavRS>
                        <BreadcrumbProgeny />
                      </NavRS> */}
                  <div>
                    <NavRS pullRight className="headNav-logout">
                      <Dropdown
                        icon={
                          <AccountCircleRoundedIcon className="headNav-profileLogo" />
                        }
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
                  </div>
                </Navbar.Body>
              </Navbar>
            </Header>
          </div>

          <Content>
            <main id="content-section">
              <div className="subNav">
                <ProgenySubNavBar
                  style={{ backgroundColor: "white" }}
                  active={active}
                  onSelect={handleSelect}
                  currentItem={currentSideItem}
                />
              </div>
              <div className="content" style={{ backgroundColor: "#f9f9f9" }}>
                <section id="overview">
                  {isLoading ? (
                    <Loader center content="Loading" />
                  ) : (
                    <Container fluid>
                      {/* MAIN COMPOENTS */}
                      <TabPanel
                        currentSubNavState={subnavState}
                        currentItem={currentSideItem}
                      />
                    </Container>
                  )}
                </section>
              </div>
            </main>
            <NavRS pullRight></NavRS>
          </Content>

          <Drawer
            size="xs"
            placement="left"
            backdrop
            show={isDrawer}
            onHide={close}
          >
            <Drawer.Header id="drawer">
              <img src={logo} className="drawer-img" />
              <div className="drawer-title">
                <div className="drawer-title-content">Progeny</div>
                <div className="drawer-title-content">Management System</div>
              </div>
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
                        icon={
                          <item.customIcon
                            className="drawer-content-icon"
                            key={i}
                          />
                        }
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
      )}
    </>
  )
}
export default Overview
