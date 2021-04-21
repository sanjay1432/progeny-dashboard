import React, { useEffect, useState, useCallback } from "react"
import OverviewService from "../../services/overview.service"
import GeneralService from "../../services/general.service"
import { useHistory } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setMill, setBU } from "../../redux/actions/app.action"
import { setProcessLines } from "../../redux/actions/dashboard.action"
import { Scrollbars } from "react-custom-scrollbars"
import { AutoSizer } from "react-virtualized"
import { Alert, Grid, Row, Col, ButtonToolbar, IconButton, Icon } from "rsuite"
import axios from "axios"
import { ACTION, CANCEL_REQUEST, MILL_INFO, MODULE } from "../../constants"
import KPICategories from "./KPICategories"
import MillOverviewDrawer from "./MillOverviewDrawer"
import moment from "moment"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
import { ModuleAbility } from "../../models/ModuleAbility"
import GeneralHelper from "../../helper/general.helper"
import Kerinci from "../../assets/img/RGE-logo/Kerinci.png"
import Rizhao from "../../assets/img/RGE-logo/Rizhao.png"
import TPL from "../../assets/img/RGE-logo/TPL.png"
import Bahia from "../../assets/img/RGE-logo/Bahia.png"

const PulpOverviewPanel = ({ buId, frequency }) => {
  const [kerinciProduction, setKerinciProduction] = useState([])
  const [rizhaoProduction, setRizhaoProduction] = useState([])
  const [tplProduction, setTplProduction] = useState([])
  const [bahiaProduction, setBahiaProduction] = useState([])
  const [showDrawer, setShowDrawer] = useState(false)
  const [selectedProduction, setSelectedProduction] = useState(null)
  const [selectedLatestDate, setSelectedLatestDate] = useState(null)
  const [selectedMill, setSelectedMill] = useState(null)
  const [latestDatesOverview, setLatestDatesOverview] = useState(null)
  const history = useHistory()
  const dispatch = useDispatch()
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  const fetchData = useCallback(
    async source => {
      await OverviewService.getAllMillLatestDate(
        {
          buId
        },
        source
      ).then(
        data => {
          setLatestDatesOverview(data)
        },
        error => {
          Alert.error("We got an unknown error.", 5000)
          console.log(error)
          return Promise.reject()
        }
      )
    },
    [buId]
  )
  useEffect(() => {
    setModuleAbility({
      kerinci: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.kerinci.millId,
        MILL_INFO.kerinci.buId
      ),
      rizhao: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.rizhao.millId,
        MILL_INFO.rizhao.buId
      ),
      tpl: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.tpl.millId,
        MILL_INFO.tpl.buId
      ),
      bahia: new ModuleAbility(
        MODULE.overview,
        MILL_INFO.bahia.millId,
        MILL_INFO.bahia.buId
      )
    })
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    if (latestDatesOverview != null) {
      OverviewService.getProductionChart(
        {
          buId,
          displayAsDate: {
            Kerinci: moment(latestDatesOverview["Kerinci"]).format(
              "YYYY-MM-DD"
            ),
            Rizhao: moment(latestDatesOverview["Rizhao"]).format("YYYY-MM-DD"),
            "TPL Toba": moment(latestDatesOverview["TPL Toba"]).format(
              "YYYY-MM-DD"
            ),
            Bahia: moment(latestDatesOverview["Bahia"]).format("YYYY-MM-DD")
          }
        },
        source
      ).then(
        data => {
          if (data) {
            setKerinciProduction(
              data["Kerinci"].sort((a, b) => {
                return b.name.localeCompare(a.name)
              })
            )
            setRizhaoProduction(data["Rizhao"])
            setTplProduction(data["TPL Toba"])
            setBahiaProduction(data["Bahia"])
          }
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [latestDatesOverview, buId])

  const gotoDashboard = async mill => {
    dispatch(setMill(mill))
    dispatch(setBU(mill.buId))
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    await GeneralService.getAllProcessLines(
      { buId: mill.buId, millId: mill.millId },
      source
    ).then(
      data => {
        dispatch(setProcessLines(data))
      },
      error => {
        Alert.error("We got an unknown error.", 5000)
        console.log(error)
        return Promise.reject()
      }
    )
    history.push({
      pathname: "/main/pulp/dashboard",
      state: {
        mill
      }
    })
  }

  const expandDashboard = millId => {
    switch (millId) {
      case MILL_INFO.kerinci.millId:
        setSelectedMill(MILL_INFO.kerinci)
        setSelectedProduction(kerinciProduction)
        setSelectedLatestDate(latestDatesOverview["Kerinci"])
        break
      case MILL_INFO.rizhao.millId:
        setSelectedMill(MILL_INFO.rizhao)
        setSelectedProduction(rizhaoProduction)
        setSelectedLatestDate(latestDatesOverview["Rizhao"])
        break
      case MILL_INFO.tpl.millId:
        setSelectedMill(MILL_INFO.tpl)
        setSelectedProduction(tplProduction)
        setSelectedLatestDate(latestDatesOverview["TPL Toba"])
        break
      case MILL_INFO.bahia.millId:
        setSelectedMill(MILL_INFO.bahia)
        setSelectedProduction(bahiaProduction)
        setSelectedLatestDate(latestDatesOverview["Bahia"])
        break
      default:
        break
    }
    setShowDrawer(true)
  }
  const closeDrawer = () => {
    setShowDrawer(false)
    setSelectedMill(null)
    setSelectedProduction(null)
  }

  return (
    <>
      <div className="opex-panel-content-overview">
        <div className="__header">
          {latestDatesOverview && (
            <Grid fluid>
              <Row>
                {moduleAbility &&
                  ability.can(ACTION.access, moduleAbility.kerinci) && (
                    <Col md={6}>
                      <div className="_grid-content top">
                        <div className="header-logo">
                          <div>
                            <img src={Kerinci} alt="RGE Group" height={20} />
                          </div>
                          <ButtonToolbar>
                            <IconButton
                              onClick={() => gotoDashboard(MILL_INFO.kerinci)}
                              icon={<Icon icon="th-large" />}
                              circle
                              size="sm"
                            />
                            <IconButton
                              onClick={() =>
                                expandDashboard(MILL_INFO.kerinci.millId)
                              }
                              icon={<Icon icon="expand" />}
                              circle
                              size="sm"
                            />
                          </ButtonToolbar>
                        </div>
                        <p className="info_box mt-1 mb-0">
                          <i className="fa fa-exclamation-circle" /> Latest date
                          available:{" "}
                          <strong>
                            {moment(latestDatesOverview["Kerinci"]).format(
                              "DD MMM YYYY"
                            )}
                            .
                          </strong>
                        </p>
                      </div>
                    </Col>
                  )}
                {moduleAbility &&
                  ability.can(ACTION.access, moduleAbility.rizhao) && (
                    <Col md={6}>
                      <div className="_grid-content top">
                        <div className="header-logo">
                          <div>
                            <img src={Rizhao} alt="RGE Group" height={20} />
                          </div>
                          <ButtonToolbar>
                            <IconButton
                              onClick={() => gotoDashboard(MILL_INFO.rizhao)}
                              icon={<Icon icon="th-large" />}
                              circle
                              size="sm"
                            />
                            <IconButton
                              onClick={() =>
                                expandDashboard(MILL_INFO.rizhao.millId)
                              }
                              icon={<Icon icon="expand" />}
                              circle
                              size="sm"
                            />
                          </ButtonToolbar>
                        </div>
                        <p className="info_box mt-1 mb-0">
                          <i className="fa fa-exclamation-circle" /> Latest date
                          available:{" "}
                          <strong>
                            {moment(latestDatesOverview["Rizhao"]).format(
                              "DD MMM YYYY"
                            )}
                            .
                          </strong>
                        </p>
                      </div>
                    </Col>
                  )}
                {moduleAbility &&
                  ability.can(ACTION.access, moduleAbility.tpl) && (
                    <Col md={6}>
                      <div className="_grid-content top">
                        <div className="header-logo">
                          <div>
                            <img src={TPL} alt="RGE Group" height={20} />
                          </div>
                          <ButtonToolbar>
                            <IconButton
                              onClick={() => gotoDashboard(MILL_INFO.tpl)}
                              icon={<Icon icon="th-large" />}
                              circle
                              size="sm"
                            />
                            <IconButton
                              onClick={() =>
                                expandDashboard(MILL_INFO.tpl.millId)
                              }
                              icon={<Icon icon="expand" />}
                              circle
                              size="sm"
                            />
                          </ButtonToolbar>
                        </div>
                        <p className="info_box mt-1 mb-0">
                          <i className="fa fa-exclamation-circle" /> Latest date
                          available:{" "}
                          <strong>
                            {moment(latestDatesOverview["TPL Toba"]).format(
                              "DD MMM YYYY"
                            )}
                            .
                          </strong>
                        </p>
                      </div>
                    </Col>
                  )}
                {moduleAbility &&
                  ability.can(ACTION.access, moduleAbility.bahia) && (
                    <Col md={6}>
                      <div className="_grid-content top">
                        <div className="header-logo">
                          <div>
                            <img src={Bahia} alt="RGE Group" height={20} />
                          </div>
                          <ButtonToolbar>
                            <IconButton
                              onClick={() => gotoDashboard(MILL_INFO.bahia)}
                              icon={<Icon icon="th-large" />}
                              circle
                              size="sm"
                            />
                            <IconButton
                              onClick={() =>
                                expandDashboard(MILL_INFO.bahia.millId)
                              }
                              icon={<Icon icon="expand" />}
                              circle
                              size="sm"
                            />
                          </ButtonToolbar>
                        </div>
                        <p className="info_box mt-1 mb-0">
                          <i className="fa fa-exclamation-circle" /> Latest date
                          available:{" "}
                          <strong>
                            {moment(latestDatesOverview["Bahia"]).format(
                              "DD MMM YYYY"
                            )}
                            .
                          </strong>
                        </p>
                      </div>
                    </Col>
                  )}
              </Row>
            </Grid>
          )}
        </div>
        <div className="__content">
          <div
            style={{
              display: "flex",
              height: "calc(100vh - 260px)"
            }}
          >
            <AutoSizer>
              {({ width, height }) => {
                return (
                  <Scrollbars style={{ width, height }}>
                    <div className="__charts">
                      <Grid fluid>
                        <Row>
                          {moduleAbility &&
                            ability.can(
                              ACTION.access,
                              moduleAbility.kerinci
                            ) && (
                              <Col md={6}>
                                <div className="_grid-content bottom">
                                  <div className="gauge_chart overview">
                                    {kerinciProduction.map(
                                      (gaugeChart, index) => {
                                        return GeneralHelper.buildGaugeChart(
                                          gaugeChart,
                                          index
                                        )
                                      }
                                    )}
                                  </div>
                                  {latestDatesOverview && (
                                    <KPICategories
                                      buId={buId}
                                      millId={MILL_INFO.kerinci.millId}
                                      frequency={frequency}
                                      displayAsDate={
                                        latestDatesOverview["Kerinci"]
                                      }
                                    />
                                  )}
                                </div>
                              </Col>
                            )}

                          {moduleAbility &&
                            ability.can(
                              ACTION.access,
                              moduleAbility.rizhao
                            ) && (
                              <Col md={6}>
                                <div className="_grid-content bottom">
                                  <div className="gauge_chart overview">
                                    {rizhaoProduction.map(
                                      (gaugeChart, index) => {
                                        return GeneralHelper.buildGaugeChart(
                                          gaugeChart,
                                          index
                                        )
                                      }
                                    )}
                                  </div>
                                  {latestDatesOverview && (
                                    <KPICategories
                                      buId={buId}
                                      millId={MILL_INFO.rizhao.millId}
                                      frequency={frequency}
                                      displayAsDate={
                                        latestDatesOverview["Rizhao"]
                                      }
                                    />
                                  )}
                                </div>
                              </Col>
                            )}
                          {moduleAbility &&
                            ability.can(ACTION.access, moduleAbility.tpl) && (
                              <Col md={6}>
                                <div className="_grid-content bottom">
                                  <div className="gauge_chart overview">
                                    {tplProduction.map((gaugeChart, index) => {
                                      return GeneralHelper.buildGaugeChart(
                                        gaugeChart,
                                        index
                                      )
                                    })}
                                  </div>
                                  {latestDatesOverview && (
                                    <KPICategories
                                      buId={buId}
                                      millId={MILL_INFO.tpl.millId}
                                      frequency={frequency}
                                      displayAsDate={
                                        latestDatesOverview["TPL Toba"]
                                      }
                                    />
                                  )}
                                </div>
                              </Col>
                            )}
                          {moduleAbility &&
                            ability.can(ACTION.access, moduleAbility.bahia) && (
                              <Col md={6}>
                                <div className="_grid-content bottom">
                                  <div className="gauge_chart overview">
                                    {bahiaProduction.map(
                                      (gaugeChart, index) => {
                                        return GeneralHelper.buildGaugeChart(
                                          gaugeChart,
                                          index
                                        )
                                      }
                                    )}
                                  </div>
                                  {latestDatesOverview && (
                                    <KPICategories
                                      buId={buId}
                                      millId={MILL_INFO.bahia.millId}
                                      frequency={frequency}
                                      displayAsDate={
                                        latestDatesOverview["Bahia"]
                                      }
                                    />
                                  )}
                                </div>
                              </Col>
                            )}
                        </Row>
                      </Grid>
                    </div>
                  </Scrollbars>
                )
              }}
            </AutoSizer>
          </div>
        </div>
      </div>
      <MillOverviewDrawer
        selectedProduction={selectedProduction}
        selectedMill={selectedMill}
        onCloseDrawer={closeDrawer}
        showDrawer={showDrawer}
        onGotoDashboard={gotoDashboard}
        displayAsDate={selectedLatestDate}
        frequency={frequency}
      />
    </>
  )
}

export default PulpOverviewPanel
