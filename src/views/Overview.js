import React, { useState, useEffect } from "react"
import OverviewService from "../services/overview.service"
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
import PulpOverviewPanel from "components/overview/PulpOveviewPanel"
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
import { setBreadcrumb, setMills } from "../redux/actions/app.action"
import axios from "axios"
import BreadcrumbOpex from "../components/nav/BreadcrumbOpex"
import { useHistory } from "react-router-dom"
import { logout } from "../redux/actions/auth.action"
import GeneralHelper from "../helper/general.helper"
import PowerOverviewPanel from "../components/overview/PowerOveviewPanel"
import ExpandChart from "../components/shared/ExpandChart"

const headerStyles = {
  padding: 8,
  paddingLeft: 16,
  height: 56,
  color: "#333",
  whiteSpace: "nowrap",
  overflow: "hidden"
}

const FREQUENCY = [
  FREQUENCY_SELECT_OPTS[1],
  FREQUENCY_SELECT_OPTS[2],
  FREQUENCY_SELECT_OPTS[3]
]
const Overview = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [frequency, setFrequency] = useState(null)
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
      dispatch(setBreadcrumb(["DMP Dashboard", "Overview"]))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      const fetchData = async () => {
        setIsLoading(true)
        setFrequency(FREQUENCY[0].value)
        await OverviewService.getAllBuMills(source).then(
          data => {
            const millList = GeneralHelper.getMillListBaseOnRoles(
              data,
              user.roles
            )
            dispatch(setMills(millList))
            if (props.location.state && props.location.state.tab === 4) {
              setActiveTab(2)
            } else {
              setActiveTab(1)
            }
            setIsLoading(false)
          },
          error => {
            Alert.error("We got an unknown error.", 5000)
            console.log(error)
            return Promise.reject()
          }
        )
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
                      <BreadcrumbOpex />
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
                          <Col lg="12">
                            <div className="main-tabs-item">
                              <Nav
                                className="main-tabs"
                                id="overview-tabs"
                                pills
                                role="tablist"
                              >
                                <NavItem>
                                  <NavLink
                                    aria-selected={activeTab === 1}
                                    className={classnames("mb-sm-3 mb-md-0", {
                                      active: activeTab === 1
                                    })}
                                    onClick={e => toggleNavs(e, 1)}
                                    href="#pablo"
                                    role="tab"
                                  >
                                    Pulp
                                  </NavLink>
                                </NavItem>
                                <NavItem>
                                  <NavLink
                                    aria-selected={activeTab === 2}
                                    className={classnames("mb-sm-3 mb-md-0", {
                                      active: activeTab === 2
                                    })}
                                    onClick={e => toggleNavs(e, 2)}
                                    href="#pablo"
                                    role="tab"
                                  >
                                    Power
                                  </NavLink>
                                </NavItem>
                              </Nav>
                              <div className="right-control">
                                <span>Line chart Frequency</span>
                                <div className="date-picker mr-0">
                                  <InputPicker
                                    className="flex-1"
                                    onChange={selected =>
                                      setFrequency(selected)
                                    }
                                    data={FREQUENCY}
                                    defaultValue={frequency}
                                    cleanable={false}
                                    block
                                  />
                                </div>
                              </div>
                            </div>
                            <Card className=" main-tabs-content">
                              <CardBody>
                                <TabContent activeTab={"activeTab" + activeTab}>
                                  <TabPane tabId="activeTab1">
                                    {activeTab === 1 ? (
                                      <PulpOverviewPanel
                                        buId={1}
                                        frequency={frequency}
                                      />
                                    ) : (
                                      ""
                                    )}
                                  </TabPane>
                                  <TabPane tabId="activeTab2">
                                    {activeTab === 2 ? (
                                      <PowerOverviewPanel />
                                    ) : (
                                      ""
                                    )}
                                  </TabPane>
                                </TabContent>
                              </CardBody>
                            </Card>
                          </Col>
                        </Row>
                      </Container>
                    )}
                  </section>
                </main>
              </Content>
            </ContainerRS>
          </ContainerRS>
          <ExpandChart />
        </div>
      )}
    </>
  )
}
export default Overview
