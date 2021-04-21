import React, { useState, useEffect, useCallback } from "react"
import classnames from "classnames"
import { useSelector, useDispatch } from "react-redux"
import { setProcessLines } from "../redux/actions/dashboard.action"
import { Loader, Alert } from "rsuite"
import axios from "axios"
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
import GeneralService from "../services/general.service"
import { setBreadcrumb } from "../redux/actions/app.action"
import ProductionTargetPanel from "components/threshold-setup/production-config/ProductionTargetPanel"
import ProcessLineTargetPanel from "components/threshold-setup/production-config/ProcessLineTargetPanel"
import AnnualPanel from "components/threshold-setup/production-config/AnnualPanel"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../config/Can"
import { ACTION, MODULE } from "../constants"
import { ModuleAbility } from "../models/ModuleAbility"
const TABS = {
  productionTarget: {
    name: "Production Target",
    slug: "production-target"
  },
  processLineTarget: {
    name: "Process Line Target",
    slug: "process-line-target"
  },
  annualConfiguration: {
    name: "Annual Configuration",
    slug: "annual-configuration"
  }
}

const ProductionThresholdSetup = props => {
  const [activeTab, setActiveTab] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const breadcrumb = useSelector(state => state.appReducer.breadcrumb)
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const mill = useSelector(state => state.appReducer.mill)
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
    if (props.location.state && props.location.state.tab) {
      const { tab, breadcrumb } = props.location.state
      setActiveTab(tab)
      dispatch(setBreadcrumb(breadcrumb))
      document.getElementById("root").click()
    } else {
      setActiveTab(TABS.productionTarget.slug) //Set default tab
      dispatch(setBreadcrumb(["Threshold Setup", TABS.productionTarget.slug]))
    }
  }, [props.location.state, dispatch])

  const getInfo = useCallback(async () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const { millId, buId } = mill
    const param = {
      buId,
      millId
    }
    const moduleAbilityObj = new ModuleAbility(MODULE.threshold, millId, buId)
    setModuleAbility({
      [MODULE.threshold]: moduleAbilityObj
    })
    if (ability.can(ACTION.read, moduleAbilityObj)) {
      if (!processLines) {
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
      }
    }
  }, [mill, dispatch, processLines, ability])

  useEffect(() => {
    getInfo()
  }, [getInfo])

  return (
    <>
      <main>
        <section id="dashboard" className="main-section">
          {isLoading ? (
            <Loader center content="Loading..........." />
          ) : (
            moduleAbility !== null &&
            ability.can(ACTION.read, moduleAbility[MODULE.threshold]) && (
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
                              activeTab === TABS.productionTarget.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === TABS.productionTarget.slug
                            })}
                            onClick={e => toggleNavs(e, TABS.productionTarget)}
                            href="#pablo"
                            role="tab"
                          >
                            {TABS.productionTarget.name}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === TABS.processLineTarget.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === TABS.processLineTarget.slug
                            })}
                            onClick={e => toggleNavs(e, TABS.processLineTarget)}
                            href="#pablo"
                            role="tab"
                          >
                            {TABS.processLineTarget.name}
                          </NavLink>
                        </NavItem>
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === TABS.annualConfiguration.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === TABS.annualConfiguration.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, TABS.annualConfiguration)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            {TABS.annualConfiguration.name}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <Card className=" main-tabs-content">
                      <CardBody>
                        <TabContent activeTab={"activeTab" + activeTab}>
                          <TabPane
                            tabId={`activeTab${TABS.productionTarget.slug}`}
                          >
                            {activeTab === TABS.productionTarget.slug ? (
                              <ProductionTargetPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                          <TabPane
                            tabId={`activeTab${TABS.processLineTarget.slug}`}
                          >
                            {activeTab === TABS.processLineTarget.slug ? (
                              <ProcessLineTargetPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                          <TabPane
                            tabId={`activeTab${TABS.annualConfiguration.slug}`}
                          >
                            {activeTab === TABS.annualConfiguration.slug ? (
                              <AnnualPanel />
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
export default ProductionThresholdSetup
