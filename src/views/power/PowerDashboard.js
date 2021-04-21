import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { useSelector, useDispatch } from "react-redux"
import { setDisplayAsDate } from "../../redux/actions/dashboard.action"
import moment from "moment"
import { DatePicker, Loader } from "rsuite"
import { ACTION, MODULE } from "../../constants"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
// reactstrap components
import {
  Container,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  Card,
  CardBody,
  TabContent,
  TabPane
} from "reactstrap"
import { setBreadcrumb } from "../../redux/actions/app.action"
import { ModuleAbility } from "../../models/ModuleAbility"
import RbSummaryPanel from "../../components/dashboard/power/RbSummaryPanel"
import KpiPowerSummaryPanel from "../../components/dashboard/power/KpiPowerSummaryPanel"
import RbComparisonPanel from "../../components/dashboard/power/RbComparisonPanel"
const DASHBOARD_TABS = {
  rbSummary: {
    name: "RB Summary",
    slug: "rb-summary"
  },
  rbComparison: {
    slug: "rb-comparison",
    name: "RB Comparison"
  },
  powerKpiSummary: {
    slug: "power-kpi-summary",
    name: "Power KPI Summary"
  }
}

const PowerDashboard = props => {
  const [activeTab, setActiveTab] = useState(null)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const mill = useSelector(state => state.appReducer.mill)
  const dispatch = useDispatch()
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  const toggleNavs = (e, index) => {
    e.preventDefault()
    let bread = breadcrumb
    bread.pop()
    setActiveTab(index.slug)
    dispatch(setBreadcrumb([...bread, index.name]))
  }

  useEffect(() => {
    const { millId, buId } = mill
    if (props.location.state && props.location.state.tab) {
      const { tab, breadcrumb } = props.location.state
      setActiveTab(tab)
      dispatch(setBreadcrumb(breadcrumb))
      document.getElementById("root").click()
    } else {
      setActiveTab(DASHBOARD_TABS.rbSummary.slug) //Set default tab
      dispatch(setBreadcrumb(["Dashboard", DASHBOARD_TABS.rbSummary.name]))
    }
    setModuleAbility({
      [MODULE.rbSummary]: new ModuleAbility(MODULE.rbSummary, millId, buId),
      [MODULE.rbComparison]: new ModuleAbility(
        MODULE.rbComparison,
        millId,
        buId
      ),
      [MODULE.powerKpiSummary]: new ModuleAbility(
        MODULE.powerKpiSummary,
        millId,
        buId
      )
    })
  }, [props.location.state, dispatch, mill])

  const selectDisplayAsDate = selected => {
    dispatch(setDisplayAsDate(moment(selected).format("YYYY-MM-DD")))
  }

  return (
    <>
      <main>
        <section id="dashboard" className="main-section">
          {displayAsDate === null || moduleAbility === null ? (
            <Loader center content="Loading dashboard" />
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
                      {ability.can(ACTION.access, moduleAbility.rbSummary) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.rbSummary.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === DASHBOARD_TABS.rbSummary.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.rbSummary)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            RB Summary
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(
                        ACTION.access,
                        moduleAbility.rbComparison
                      ) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.rbComparison.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === DASHBOARD_TABS.rbComparison.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.rbComparison)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            RB Comparison
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(
                        ACTION.access,
                        moduleAbility.powerKpiSummary
                      ) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.powerKpiSummary.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab ===
                                DASHBOARD_TABS.powerKpiSummary.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.powerKpiSummary)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Power KPI Summary
                          </NavLink>
                        </NavItem>
                      )}
                    </Nav>
                    <div className="right-control">
                      <span>Date:</span>
                      <div className="date-picker mr-0">
                        <DatePicker
                          placement="auto"
                          style={{ width: 165 }}
                          format="DD MMM YYYY"
                          oneTap={true}
                          cleanable={false}
                          value={new Date(displayAsDate)}
                          onChange={selected => selectDisplayAsDate(selected)}
                        />
                      </div>
                    </div>
                  </div>
                  <Card className=" main-tabs-content">
                    <CardBody>
                      <TabContent activeTab={"activeTab" + activeTab}>
                        {ability.can(
                          ACTION.access,
                          moduleAbility.rbSummary
                        ) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.rbSummary.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.rbSummary.slug ? (
                              <RbSummaryPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(
                          ACTION.access,
                          moduleAbility.rbComparison
                        ) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.rbComparison.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.rbComparison.slug ? (
                              <RbComparisonPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(
                          ACTION.access,
                          moduleAbility.powerKpiSummary
                        ) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.powerKpiSummary.slug}`}
                          >
                            {activeTab ===
                            DASHBOARD_TABS.powerKpiSummary.slug ? (
                              <KpiPowerSummaryPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                      </TabContent>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          )}
        </section>
      </main>
    </>
  )
}
export default PowerDashboard
