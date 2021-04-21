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
import ConsumptionPanel from "../components/threshold-setup/other-kpis/ConsumptionPanel"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../config/Can"
import { ModuleAbility } from "../models/ModuleAbility"
import { ACTION, MODULE } from "../constants"
const TABS = {
  consumptionConfiguration: {
    name: "Consumption Configuration",
    slug: "consumption-configuration"
  }
}

const OtherKpisThresholdSetup = props => {
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
    setActiveTab(TABS.consumptionConfiguration.slug) //Set default tab
    dispatch(
      setBreadcrumb([
        "Setup",
        "Threshold Setup",
        TABS.consumptionConfiguration.name
      ])
    )
  }, [props.location.state, dispatch])

  const getInfo = useCallback(async () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const { millId, buId } = mill
    const param = {
      buId,
      millId
    }
    const moduleAbility1 = new ModuleAbility(MODULE.threshold, millId, buId)
    setModuleAbility({
      [MODULE.threshold]: moduleAbility1
    })
    if (ability.can([ACTION.read], moduleAbility1)) {
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
                              activeTab === TABS.consumptionConfiguration.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab === TABS.consumptionConfiguration.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, TABS.consumptionConfiguration)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            {TABS.consumptionConfiguration.name}
                          </NavLink>
                        </NavItem>
                      </Nav>
                    </div>
                    <Card className=" main-tabs-content">
                      <CardBody>
                        <TabContent activeTab={"activeTab" + activeTab}>
                          <TabPane
                            tabId={`activeTab${TABS.consumptionConfiguration.slug}`}
                          >
                            {activeTab ===
                            TABS.consumptionConfiguration.slug ? (
                              <ConsumptionPanel />
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
export default OtherKpisThresholdSetup
