import React, { useState, useEffect } from "react"
import classnames from "classnames"
import SummaryTodayPanel from "components/lostcook/SummaryTodayPanel"
import SummaryOverallPanel from "components/lostcook/SummaryOverallPanel"
import LostcookAnalysisPanel from "components/lostcook/LostcookAnalysisPanel"
import AnalyticsPanel from "components/lostcook/AnalyticsPanel"
import { useSelector, useDispatch } from "react-redux"
import { setFiberlines } from "../../redux/actions/lostcook.action"
import { Loader, Alert } from "rsuite"
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
import axios from "axios"
import LostcookSevice from "../../services/lostcook.service"
import { setBreadcrumb } from "../../redux/actions/app.action"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
import { ACTION, MODULE } from "../../constants"
import { ModuleAbility } from "../../models/ModuleAbility"

// Named tabs
const LOSTCOOK_TABS = {
  summary_today: {
    name: " Summary Today",
    slug: "summary-today"
  },
  summary_overall: {
    name: "Summary Overall",
    slug: "summary-overall"
  },
  lostcook_analysis: {
    name: "Lostcook Analysis",
    slug: "lostcook-analysis"
  },
  textual_analysis: {
    name: "Textual Analysis",
    slug: "textual-analysis"
  }
}

const Lostcook = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const mill = useSelector(state => state.appReducer.mill)
  const dispatch = useDispatch()
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)
  const [latestDate, setLatestDate] = useState(null)
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
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const fetchData = async () => {
      setIsLoading(true)
      const { millId, buId } = mill

      const moduleA = new ModuleAbility(MODULE.lostcookAnalytics, millId, buId)
      setModuleAbility({
        [MODULE.lostcookAnalytics]: moduleA
      })
      await LostcookSevice.getLatestDate(source).then(
        data => {
          setLatestDate(data.latestDate)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
      await LostcookSevice.fiberlineList({ millId: mill.millId }, source).then(
        data => {
          dispatch(setFiberlines(data))
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
    if (props.location.state && props.location.state.tab) {
      const { tab, breadcrumb } = props.location.state
      setActiveTab(tab)
      dispatch(setBreadcrumb(breadcrumb))
      document.getElementById("root").click()
    } else {
      setActiveTab(LOSTCOOK_TABS.summary_today.slug)
      dispatch(
        setBreadcrumb(["Lostcook Analytics", LOSTCOOK_TABS.summary_today.slug])
      )
    }
  }, [props, mill, dispatch, ability])
  return (
    <>
      <main>
        <section id="lostcook" className="main-section">
          {isLoading ? (
            <Loader center content="Loading" />
          ) : (
            moduleAbility !== null &&
            ability.can(
              ACTION.access,
              moduleAbility[MODULE.lostcookAnalytics]
            ) && (
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
                            aria-selected={
                              activeTab === LOSTCOOK_TABS.summary_today.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === LOSTCOOK_TABS.summary_today.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, LOSTCOOK_TABS.summary_today)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Summary Today
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === LOSTCOOK_TABS.summary_overall.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === LOSTCOOK_TABS.summary_overall.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, LOSTCOOK_TABS.summary_overall)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Summary Overall
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === LOSTCOOK_TABS.lostcook_analysis.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab ===
                                LOSTCOOK_TABS.lostcook_analysis.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, LOSTCOOK_TABS.lostcook_analysis)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Lostcook Analysis
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === LOSTCOOK_TABS.textual_analysis.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab ===
                                LOSTCOOK_TABS.textual_analysis.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, LOSTCOOK_TABS.textual_analysis)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            Analytics
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <Card className=" main-tabs-content">
                      <CardBody>
                        <TabContent activeTab={"activeTab" + activeTab}>
                          <TabPane
                            tabId={`activeTab${LOSTCOOK_TABS.summary_today.slug}`}
                          >
                            {activeTab === LOSTCOOK_TABS.summary_today.slug ? (
                              <SummaryTodayPanel latestDate={latestDate} />
                            ) : (
                              ""
                            )}
                          </TabPane>
                          <TabPane
                            tabId={`activeTab${LOSTCOOK_TABS.summary_overall.slug}`}
                          >
                            {activeTab ===
                            LOSTCOOK_TABS.summary_overall.slug ? (
                              <SummaryOverallPanel latestDate={latestDate} />
                            ) : (
                              ""
                            )}
                          </TabPane>
                          <TabPane
                            tabId={`activeTab${LOSTCOOK_TABS.lostcook_analysis.slug}`}
                          >
                            {activeTab ===
                            LOSTCOOK_TABS.lostcook_analysis.slug ? (
                              <LostcookAnalysisPanel latestDate={latestDate} />
                            ) : (
                              ""
                            )}
                          </TabPane>
                          <TabPane
                            tabId={`activeTab${LOSTCOOK_TABS.textual_analysis.slug}`}
                          >
                            {activeTab ===
                            LOSTCOOK_TABS.textual_analysis.slug ? (
                              <AnalyticsPanel latestDate={latestDate} />
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
            )
          )}
        </section>
      </main>
    </>
  )
}
export default Lostcook
