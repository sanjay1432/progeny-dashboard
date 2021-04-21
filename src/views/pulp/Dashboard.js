import React, { useState, useEffect } from "react"
import classnames from "classnames"
import ProductionPanel from "../../components/dashboard/pulp/ProductionPanel"
import { useSelector, useDispatch } from "react-redux"
import { setDisplayAsDate } from "../../redux/actions/dashboard.action"
import moment from "moment"
import { DatePicker, Loader } from "rsuite"
import {
  ACTION,
  KPI_CATEGORIES,
  MILL_INFO,
  MODULE,
  VIEW_TYPE
} from "../../constants"
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
  TabPane,
  Button,
  ButtonGroup
} from "reactstrap"
import ConsumptionPanel from "../../components/dashboard/pulp/ConsumptionPanel"
import ConsumptionTable from "../../components/dashboard/pulp/ConsumptionTable"
import SummaryPanel from "../../components/dashboard/pulp/SummaryPanel"
import { setBreadcrumb } from "../../redux/actions/app.action"
import { ModuleAbility } from "../../models/ModuleAbility"
import ProductionTable from "../../components/dashboard/pulp/ProductionTable"
const DASHBOARD_TABS = {
  summary: {
    name: "Summary",
    slug: "summary"
  },
  production: {
    name: "Production",
    slug: "production"
  },
  chemical: {
    name: "Chemical",
    slug: "chemical"
  },
  utility: {
    name: "Utility",
    slug: "utility"
  },
  wood: {
    name: "Wood",
    slug: "wood"
  },
  quality: {
    name: "Quality",
    slug: "quality"
  }
}

const Dashboard = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [viewType, setViewType] = useState(VIEW_TYPE.chart)
  const [isShowQuality, setIsShowQuality] = useState(true)
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
    if (millId === MILL_INFO.bahia.millId) {
      setIsShowQuality(false)
      if (activeTab === DASHBOARD_TABS.quality.slug) {
        setActiveTab(DASHBOARD_TABS.production.slug) //Set default tab
        dispatch(setBreadcrumb(["Dashboard", DASHBOARD_TABS.production.name]))
      }
    } else {
      setIsShowQuality(true)
    }
    setModuleAbility({
      [MODULE.summary]: new ModuleAbility(MODULE.summary, millId, buId),
      [MODULE.production]: new ModuleAbility(MODULE.production, millId, buId),
      [MODULE.chemical]: new ModuleAbility(MODULE.chemical, millId, buId),
      [MODULE.utility]: new ModuleAbility(MODULE.utility, millId, buId),
      [MODULE.wood]: new ModuleAbility(MODULE.wood, millId, buId),
      [MODULE.quality]: new ModuleAbility(MODULE.quality, millId, buId)
    })
  }, [dispatch, activeTab, mill])

  useEffect(() => {
    if (props.location.state && props.location.state.tab) {
      const { tab, breadcrumb } = props.location.state
      setActiveTab(tab)
      dispatch(setBreadcrumb(breadcrumb))
      document.getElementById("root").click()
    } else {
      setActiveTab(DASHBOARD_TABS.production.slug) //Set default tab
      dispatch(setBreadcrumb(["Dashboard", DASHBOARD_TABS.production.name]))
    }
  }, [props.location.state, dispatch])

  const selectDisplayAsDate = selected => {
    dispatch(setDisplayAsDate(moment(selected).format("YYYY-MM-DD")))
  }

  return (
    <>
      <main>
        <section id="dashboard" className="main-section">
          {displayAsDate === null || moduleAbility === null ? (
            <Loader center content="Loading..........." />
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
                      {ability.can(ACTION.access, moduleAbility.summary) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.summary.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === DASHBOARD_TABS.summary.slug
                            })}
                            onClick={e => toggleNavs(e, DASHBOARD_TABS.summary)}
                            href="#pablo"
                            role="tab"
                          >
                            Summary
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(ACTION.access, moduleAbility.production) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.production.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === DASHBOARD_TABS.production.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.production)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Production
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(ACTION.access, moduleAbility.chemical) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.chemical.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === DASHBOARD_TABS.chemical.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.chemical)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Chemical
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(ACTION.access, moduleAbility.utility) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.utility.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === DASHBOARD_TABS.utility.slug
                            })}
                            onClick={e => toggleNavs(e, DASHBOARD_TABS.utility)}
                            href="#pablo"
                            role="tab"
                          >
                            Utility
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(ACTION.access, moduleAbility.utility) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.wood.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === DASHBOARD_TABS.wood.slug
                            })}
                            onClick={e => toggleNavs(e, DASHBOARD_TABS.wood)}
                            href="#pablo"
                            role="tab"
                          >
                            Wood
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(ACTION.access, moduleAbility.utility) &&
                        isShowQuality && (
                          <NavItem>
                            <NavLink
                              aria-selected={
                                activeTab === DASHBOARD_TABS.quality.slug
                              }
                              className={classnames("mb-sm-3 mb-md-0", {
                                active:
                                  activeTab === DASHBOARD_TABS.quality.slug
                              })}
                              onClick={e =>
                                toggleNavs(e, DASHBOARD_TABS.quality)
                              }
                              href="#pablo"
                              role="tab"
                            >
                              Quality
                            </NavLink>
                          </NavItem>
                        )}
                    </Nav>
                    <div className="right-control">
                      <span>Date:</span>
                      <div className="date-picker">
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
                      <ButtonGroup>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => setViewType(VIEW_TYPE.chart)}
                          active={viewType === VIEW_TYPE.chart}
                        >
                          <i className="fa fa-line-chart" />
                        </Button>
                        <Button
                          size="sm"
                          color="primary"
                          onClick={() => setViewType(VIEW_TYPE.table)}
                          active={viewType === VIEW_TYPE.table}
                        >
                          <i className="fa fa-table" />
                        </Button>
                      </ButtonGroup>
                    </div>
                  </div>
                  <Card className=" main-tabs-content">
                    <CardBody>
                      <TabContent activeTab={"activeTab" + activeTab}>
                        {ability.can(ACTION.access, moduleAbility.summary) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.summary.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.summary.slug ? (
                              <SummaryPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(
                          ACTION.access,
                          moduleAbility.production
                        ) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.production.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.production.slug ? (
                              viewType === VIEW_TYPE.chart ? (
                                <ProductionPanel
                                  kpiCategoryId={
                                    KPI_CATEGORIES.production.kpiCategoryId
                                  }
                                />
                              ) : (
                                <ProductionTable />
                              )
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(ACTION.access, moduleAbility.chemical) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.chemical.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.chemical.slug ? (
                              viewType === VIEW_TYPE.chart ? (
                                <ConsumptionPanel
                                  kpiCategoryId={
                                    KPI_CATEGORIES.chemical.kpiCategoryId
                                  }
                                />
                              ) : (
                                <ConsumptionTable
                                  totalTblProdKpiFlag={false}
                                  kpiCategoryId={
                                    KPI_CATEGORIES.chemical.kpiCategoryId
                                  }
                                  tableName={DASHBOARD_TABS.chemical.name}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(ACTION.access, moduleAbility.utility) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.utility.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.utility.slug ? (
                              viewType === VIEW_TYPE.chart ? (
                                <ConsumptionPanel
                                  kpiCategoryId={
                                    KPI_CATEGORIES.utility.kpiCategoryId
                                  }
                                />
                              ) : (
                                <ConsumptionTable
                                  totalTblProdKpiFlag={false}
                                  kpiCategoryId={
                                    KPI_CATEGORIES.utility.kpiCategoryId
                                  }
                                  tableName={DASHBOARD_TABS.utility.name}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(ACTION.access, moduleAbility.wood) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.wood.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.wood.slug ? (
                              viewType === VIEW_TYPE.chart ? (
                                <ConsumptionPanel
                                  kpiCategoryId={
                                    KPI_CATEGORIES.wood.kpiCategoryId
                                  }
                                />
                              ) : (
                                <ConsumptionTable
                                  totalTblProdKpiFlag={false}
                                  kpiCategoryId={
                                    KPI_CATEGORIES.wood.kpiCategoryId
                                  }
                                  tableName={DASHBOARD_TABS.wood.name}
                                />
                              )
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}

                        {isShowQuality &&
                          ability.can(ACTION.access, moduleAbility.quality) && (
                            <TabPane
                              tabId={`activeTab${DASHBOARD_TABS.quality.slug}`}
                            >
                              {activeTab === DASHBOARD_TABS.quality.slug ? (
                                viewType === VIEW_TYPE.chart ? (
                                  <ConsumptionPanel
                                    kpiCategoryId={
                                      KPI_CATEGORIES.quality.kpiCategoryId
                                    }
                                  />
                                ) : (
                                  <ConsumptionTable
                                    totalTblProdKpiFlag={false}
                                    kpiCategoryId={
                                      KPI_CATEGORIES.quality.kpiCategoryId
                                    }
                                    tableName={DASHBOARD_TABS.quality.name}
                                  />
                                )
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
export default Dashboard
