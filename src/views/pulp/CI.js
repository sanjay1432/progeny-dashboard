import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { useSelector, useDispatch } from "react-redux"
import {
  setDisplayAsDate,
  setLatestDate,
  setProcessLines
} from "../../redux/actions/dashboard.action"
import { Loader, Alert } from "rsuite"
import axios from "axios"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../constants"
import Filter from "../../components/ci/Filter"

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
import GeneralService from "../../services/general.service"
import SummaryPanel from "../../components/ci/SummaryPanel"
import CIService from "../../services/ci.service"
import { setBreadcrumb } from "../../redux/actions/app.action"
import { ModuleAbility } from "../../models/ModuleAbility"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
const CI_TABS = {
  summary: {
    name: "Summary",
    slug: "summary"
  },
  improvement: {
    name: "Improvement",
    slug: "improvement"
  }
}

const CI = props => {
  const [kpis, setKpis] = useState(null)
  const [filterParams, setFilterParams] = useState({})
  const processLines = useSelector(state => state.dashboardReducer.processLines)

  const [kpiData, setKpiData] = useState(null)

  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const mill = useSelector(state => state.appReducer.mill)
  const dispatch = useDispatch()
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  const toggleNavs = (e, index) => {
    e.preventDefault()
    setActiveTab(index.slug)
  }

  useEffect(() => {
    const { millId, buId } = mill
    const fetchData = async source => {
      setIsLoading(true)
      const param = {
        buId,
        millId,
        kpiCategoryIds: [2, 3, 4, 5]
      }
      await GeneralService.getLatestDate(param, source).then(
        data => {
          dispatch(setLatestDate(data.datetime))
          dispatch(setDisplayAsDate(data.datetime))
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await GeneralService.getAllProcessLines(param, source).then(
        data => {
          dispatch(setProcessLines(data))
          setIsLoading(false)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await GeneralService.getKpis(param, source).then(
        data => {
          setKpis(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    }
    const moduleAbilityObj = new ModuleAbility(
      MODULE.pulpContinuousImprovement,
      millId,
      buId
    )
    setModuleAbility({
      [MODULE.pulpContinuousImprovement]: moduleAbilityObj
    })
    if (ability.can(ACTION.access, moduleAbilityObj)) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      fetchData(source)

      if (props.location.state && props.location.state.tab) {
        const tab = props.location.state.tab
        setActiveTab(tab)
        dispatch(setBreadcrumb(["Continuous Improvement"]))
        document.getElementById("root").click()
      } else {
        setActiveTab(CI_TABS.summary.slug) //Set default tab
        dispatch(setBreadcrumb(["Continuous Improvement"]))
      }
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [props, mill, dispatch, ability])

  const onFilter = params => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    CIService.getKPI(params, source).then(
      data => {
        setKpiData(data)
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )

    setActiveTab(CI_TABS.summary.slug)
    setFilterParams(params)
  }

  return (
    <>
      <main>
        <section id="ci" className="main-section">
          {isLoading ? (
            <Loader center content="Loading" />
          ) : (
            moduleAbility !== null &&
            ability.can(
              ACTION.access,
              moduleAbility[MODULE.pulpContinuousImprovement]
            ) && (
              <>
                <Filter
                  kpisCategories={kpis}
                  processLines={processLines}
                  onFilter={onFilter}
                />

                <Container
                  fluid
                  className={kpiData && kpiData.length > 0 ? "" : "d-none"}
                >
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
                              aria-selected={activeTab === CI_TABS.summary.slug}
                              className={classnames("mb-sm-3 mb-md-0", {
                                active: activeTab === CI_TABS.summary.slug
                              })}
                              onClick={e => toggleNavs(e, CI_TABS.summary)}
                              href="#pablo"
                              role="tab"
                            >
                              KPI Performance Summary
                            </NavLink>
                          </NavItem>
                          {/*<NavItem>*/}
                          {/*    <NavLink*/}
                          {/*        aria-selected={activeTab === CI_TABS.improvement.slug}*/}
                          {/*        className={classnames("mb-sm-3 mb-md-0", {*/}
                          {/*            active: activeTab === CI_TABS.improvement.slug*/}
                          {/*        })}*/}
                          {/*        onClick={e => toggleNavs(e, CI_TABS.improvement)}*/}
                          {/*        href="#pablo"*/}
                          {/*        role="tab"*/}
                          {/*    >*/}
                          {/*        Improvement Projects*/}
                          {/*    </NavLink>*/}
                          {/*</NavItem>*/}
                        </Nav>
                      </div>
                      <Card
                        className=" main-tabs-content"
                        style={{
                          height: `calc(100vh - 262px)`
                        }}
                      >
                        <CardBody>
                          <TabContent activeTab={"activeTab" + activeTab}>
                            <TabPane tabId={`activeTab${CI_TABS.summary.slug}`}>
                              {activeTab === CI_TABS.summary.slug ? (
                                <SummaryPanel
                                  kpiData={kpiData}
                                  filterParams={filterParams}
                                />
                              ) : (
                                ""
                              )}
                            </TabPane>
                            {/*<TabPane tabId={`activeTab${CI_TABS.improvement.slug}`}>*/}
                            {/*    {activeTab === CI_TABS.improvement.slug ?<ImprovementPanel kpiCategoryId={KPI_CATEGORIES.production.kpiCategoryId}/> :''}*/}
                            {/*</TabPane>*/}
                          </TabContent>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </>
            )
          )}
        </section>
      </main>
    </>
  )
}
export default CI
