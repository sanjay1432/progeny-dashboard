import React, { useState, useEffect } from "react"
import { CANCEL_REQUEST } from "../constants"
import MenuRoundedIcon from "@material-ui/icons/MenuRounded"
import ImportantDevicesRoundedIcon from "@material-ui/icons/ImportantDevicesRounded"
import SupervisedUserCircleRoundedIcon from "@material-ui/icons/SupervisedUserCircleRounded"
import AccountCircleRoundedIcon from "@material-ui/icons/AccountCircleRounded"
import logo from "assets/img/Progeny-logo/logoStyle02.png"
// reactstrap components
import { Container } from "reactstrap"

import {
  Loader,
  Header,
  Navbar,
  Icon,
  Content,
  Nav as NavRS,
  Container as ContainerRS,
  Dropdown,
  Drawer,
  Sidenav
} from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import { getDashboardData } from "../redux/actions/dashboarddata.action"
import axios from "axios"
import ProgenySubNavBar from "../components/nav/ProgenySubNavBar"
import TabPanel from "../components/shared/TabPanel"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"

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
            type: "select",
            disable: false
          },
          {
            name: "estatefullname",
            label: "Estate Full Name",
            type: "select",
            disable: false
          }
        ],
        search: true
      },
      {
        name: "Trial and Replicate",
        eventKey: "trial",
        filters: [
          {
            name: "trialCode",
            label: "Trial Id",
            type: "select",
            disable: false
          },
          {
            name: "planteddate",
            label: "Planted Date (year)",
            type: "select",
            disable: false
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false
          },
          // {
          //   name: "soiltype",
          //   label: "Soil Type",
          //   type: "select",
          //   disable: false
          // }
        ],
        search: false
      },
      {
        name: "Plot",
        eventKey: "plot",
        filters: [
          {
            name: "trialCode",
            label: "Trial Id",
            type: "select",
            disable: false
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false
          },
          {
            name: "replicate",
            label: "Replicate",
            type: "select",
            disable: true
          }
        ],
        search: false
      },
      {
        name: "Palm",
        eventKey: "palm",
        filters: [
          {
            name: "trialCode",
            label: "Trial Id",
            type: "select",
            disable: false
          },
          {
            name: "estate",
            label: "Estate",
            type: "select",
            disable: false
          },
          {
            name: "replicate",
            label: "Replicate",
            type: "select",
            disable: true
          },
          {
            name: "plot",
            label: "Plot",
            type: "select",
            disable: true
          }
        ],
        search: false
      },
      {
        name: "Progeny",
        eventKey: "progeny",
        filters: [
          {
            name: "progenyCode",
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
            name: "username",
            label: "Username",
            type: "text"
          },
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
        eventKey: "estateAssignment",
        filters: [
          {
            name: "estate",
            label: "Estate",
            type: "select"
          },
          {
            name: "estatefullname",
            label: "Estate Full Name",
            type: "select",
            disable: false
          }
        ],
        search: true
      },
      {
        name: "User Assignment",
        eventKey: "userAssignment",
        filters: [
          {
            name: "username",
            label: "Username",
            type: "text"
          },
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
  //const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isDrawer, setDrawer] = useState(false)
  const [sidenavState, setSidenavState] = useState(initialSidenavState)
  const [subnavState, setSubnavState] = useState(initialSubnavState)
  const dispatch = useDispatch()
  // dispatch(clearBreadcrumb())
  const { isLoggedIn, user } = useSelector(state => state.authReducer)

  const history = useHistory()
  const currentSideItem = listItems.find(
    item => item.eventKey === sidenavState.activeKey
  )

  console.log("currentSideItem", currentSideItem)

  // console.log({ currentSideItem }, sidenavState)
  // const toggleNavs = (e, index) => {
  //   e.preventDefault()
  //   setActiveTab(index)
  // }
  function toggleDrawer() {
    setDrawer(true)
  }
  function handleSelectTab(eventKey) {
    setSidenavState(() => ({ ...sidenavState, activeKey: eventKey }))
    if (eventKey === "2") {
      setSubnavState(() => ({ ...subnavState, active: "userlist" }))
      handleSelect("userlist")
    } else {
      setSubnavState(() => ({ ...subnavState, active: "estate" }))
      handleSelect("estate")
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

  if (isLoading) {
    return <Loader center content="Loading" />
  }
  const { activeKey, expanded } = sidenavState
  const { active } = subnavState
  return (
    <>
      {isLoggedIn && (
        <ContainerRS>
          <Header>
            <Navbar>
              <Navbar.Header id="header">
                <div className="headerLayout">
                  <MenuRoundedIcon
                    className="toggle"
                    onClick={() => toggleDrawer()}
                  />
                  <img
                    className="progenyLogo"
                    alt="Progeny Management System"
                    src={logo}
                  />

                  <p className="title">Progeny Management System</p>

                  <NavRS pullRight className="logoutToggle">
                    <Dropdown
                      icon={<AccountCircleRoundedIcon className="logoutLogo" />}
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
              </Navbar.Header>
            </Navbar>

            <div id="subNavigation">
              <ProgenySubNavBar
                active={active}
                onSelect={handleSelect}
                currentItem={currentSideItem}
              />
            </div>
          </Header>

          <Content>
            <main id="contentSection">
              <div className="content">
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
            id="sideNavigation"
            size="xs"
            placement="left"
            backdrop
            show={isDrawer}
            onHide={close}
          >
            <Drawer.Header>
              <img src={logo} className="progenyLogo" />
              <div className="title">
                <b className="titleContent">Progeny</b>
                <b className="titleContent">Management System</b>
              </div>
            </Drawer.Header>
            <Drawer.Body>
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
                          <item.customIcon className="contentIcon" key={i} />
                        }
                      >
                        <p className="contentText">{item.name}</p>
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
