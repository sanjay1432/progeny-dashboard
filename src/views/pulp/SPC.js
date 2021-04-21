import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { useSelector, useDispatch } from "react-redux"
import { Loader } from "rsuite"
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
import Blank from "../../components/shared/Blank"
import SPCLogsPanel from "../../components/spc/SPCLogsPanel"
const DASHBOARD_TABS = {
  spcLogs: {
    name: "SPC Logs",
    slug: "spc-logs"
  },
  targetDefinition: {
    name: "Target Definition",
    slug: "target-definition"
  }
}

const SPC = props => {
  const [activeTab, setActiveTab] = useState(null)
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
    if (props.location.state && props.location.state.tab) {
      console.log("props.location.state.tab", props.location.state.tab)
      const { tab, breadcrumb } = props.location.state
      setActiveTab(tab)
      dispatch(setBreadcrumb(breadcrumb))
      document.getElementById("root").click()
    } else {
      setActiveTab(DASHBOARD_TABS.spcLogs.slug) //Set default tab
      dispatch(setBreadcrumb(["SPC   ", DASHBOARD_TABS.spcLogs.name]))
    }
    const { millId, buId } = mill
    setModuleAbility({
      [MODULE.spcLogs]: new ModuleAbility(MODULE.spcLogs, millId, buId),
      [MODULE.spcTargetDefinition]: new ModuleAbility(
        MODULE.spcTargetDefinition,
        millId,
        buId
      )
    })
  }, [mill, props.location.state, dispatch])

  return (
    <>
      <main>
        <section id="spc" className="main-section">
          {moduleAbility === null ? (
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
                      {ability.can(ACTION.access, moduleAbility.spcLogs) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.spcLogs.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active: activeTab === DASHBOARD_TABS.spcLogs.slug
                            })}
                            onClick={e => toggleNavs(e, DASHBOARD_TABS.spcLogs)}
                            href="#pablo"
                            role="tab"
                          >
                            {DASHBOARD_TABS.spcLogs.name}
                          </NavLink>
                        </NavItem>
                      )}
                      {ability.can(
                        ACTION.access,
                        moduleAbility.spcTargetDefinition
                      ) && (
                        <NavItem>
                          <NavLink
                            aria-selected={
                              activeTab === DASHBOARD_TABS.targetDefinition.slug
                            }
                            className={classnames("mb-sm-3 mb-md-0", {
                              active:
                                activeTab ===
                                DASHBOARD_TABS.targetDefinition.slug
                            })}
                            onClick={e =>
                              toggleNavs(e, DASHBOARD_TABS.targetDefinition)
                            }
                            href="#pablo"
                            role="tab"
                          >
                            {DASHBOARD_TABS.targetDefinition.name}
                          </NavLink>
                        </NavItem>
                      )}
                    </Nav>
                  </div>
                  <Card className=" main-tabs-content">
                    <CardBody>
                      <TabContent activeTab={"activeTab" + activeTab}>
                        {ability.can(ACTION.access, moduleAbility.spcLogs) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.spcLogs.slug}`}
                          >
                            {activeTab === DASHBOARD_TABS.spcLogs.slug ? (
                              <SPCLogsPanel />
                            ) : (
                              ""
                            )}
                          </TabPane>
                        )}
                        {ability.can(
                          ACTION.access,
                          moduleAbility.spcTargetDefinition
                        ) && (
                          <TabPane
                            tabId={`activeTab${DASHBOARD_TABS.targetDefinition.slug}`}
                          >
                            {activeTab ===
                            DASHBOARD_TABS.targetDefinition.slug ? (
                              <Blank />
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
export default SPC
