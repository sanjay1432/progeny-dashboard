import React, { useEffect, useState } from "react"
import FilterCollapsible from "../shared/FilterCollapsible"
import { Scrollbars } from "react-custom-scrollbars"
import { Button, Card, CardBody, Col, Container, Row } from "reactstrap"
import { Alert, DateRangePicker, SelectPicker, DatePicker } from "rsuite"
import moment from "moment"
import { useSelector } from "react-redux"
import SPCService from "../../services/spc.service"
import {
  CANCEL_REQUEST,
  LINE_CHART_OPTION,
  PATTERN_COLORS
} from "../../constants"
import axios from "axios"
import EchartOpex from "../shared/EchartOpex"
import BasicCardContainer from "../shared/BasicCardContainer"
import _ from "lodash"
import EventsTable from "./spc-logs/EventsTable"
import EventsChart from "./spc-logs/EventsChart"
import SPCChart from "./spc-logs/SPCChart"
import Correlation from "./spc-logs/Correlation"

const SPCLogsPanel = () => {
  const mill = useSelector(state => state.appReducer.mill)
  const { allowedMaxDays, afterToday, combine } = DateRangePicker
  const [dateRange, setDateRange] = useState([
    new Date(moment(new Date()).add(-10, "days").format("DD MMM YYYY")),
    new Date()
  ])
  const [kpis, setKpis] = useState([])
  const [patterns, setPatterns] = useState(null)
  const [selectedKPI, setSelectedKPI] = useState(null)
  const [processes, setProcesses] = useState([])
  const [selectedProcesses, setSelectedProcesses] = useState(null)
  const [selectedPattern, setSelectedPattern] = useState(null)
  const [processLines, setProcessLines] = useState([])
  const [selectedProcessLines, setSelectedProcessLines] = useState(null)
  const [spcSelectedDate, setSpcSelectedDate] = useState(null)
  const [spcSelectedKpi, setSpcSelectedKpi] = useState(null)
  const [events, setEvents] = useState({})
  const [contentHeight, setContentHeight] = useState(100)
  const [correlationStartTime, setCorrelationStartTime] = useState(new Date())
  const [correlationEndTime, setCorrelationEndTime] = useState(new Date())
  const [correlationDelay, setCorrelationDelay] = useState(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      5
    )
  )
  const [correlationTable, setCorrelationTable] = useState(null)
  const [correlationHeatmap, setCorrelationHeatmap] = useState(null)
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()

  useEffect(() => {
    SPCService.getProcessLines({ millId: mill.millId }, source).then(
      data => {
        setProcesses(data)
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error("We got an unknown error.", 5000)
        }
        console.log(error)
        return Promise.reject()
      }
    )
    SPCService.getKpis({ millId: mill.millId }, source).then(
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
    SPCService.getProcessLines({ millId: mill.millId }, source).then(
      data => {
        setProcessLines(data)
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error("We got an unknown error.", 5000)
        }
        console.log(error)
        return Promise.reject()
      }
    )
    const contentH =
      Math.max(
        document.getElementById("kpi-event_filter").clientHeight || 0,
        document.getElementById("kpi-event_filter").innerHeight || 0
      ) + 215
    setContentHeight(contentH)
  }, [mill])

  const applyFilter = () => {
    if (selectedKPI && selectedProcessLines && selectedProcesses) {
      setSpcSelectedDate(null)
      SPCService.getPatterns(
        {
          millId: mill.millId,
          buId: mill.buId,
          dateRange,
          kpiId: selectedKPI.kpiId,
          pitag: selectedKPI.pitag,
          processLines: selectedProcessLines,
          processes: selectedProcesses
        },
        source
      ).then(
        data => {
          if (data) {
            setSpcSelectedKpi(selectedKPI)
            setPatterns(buildPatternChartData(data))
          }
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error(
              error.message || "API error, please contact Dev team to check.",
              5000
            )
          }
          console.log(error)
          return Promise.reject()
        }
      )
    } else {
      Alert.info("Please select all filter selections")
    }
  }

  const buildPatternChartData = data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    option.legend = null
    option.dataZoom = [
      {
        show: true,
        realtime: true,
        start: 0,
        end: 100
      }
    ]
    const date = []
    const patternsArr = {
      p1: [],
      p2: [],
      p3: [],
      p4: [],
      p5: [],
      p6: [],
      p7: [],
      p8: []
    }
    data.forEach((item, index) => {
      date.push(item.date)
      item.data["p1"]
        ? patternsArr.p1.push(item.data["p1"])
        : patternsArr.p1.push(0)
      item.data["p2"]
        ? patternsArr.p2.push(item.data["p2"])
        : patternsArr.p1.push(0)
      item.data["p3"]
        ? patternsArr.p3.push(item.data["p3"])
        : patternsArr.p1.push(0)
      item.data["p4"]
        ? patternsArr.p4.push(item.data["p4"])
        : patternsArr.p1.push(0)
      item.data["p5"]
        ? patternsArr.p5.push(item.data["p5"])
        : patternsArr.p1.push(0)
      item.data["p6"]
        ? patternsArr.p6.push(item.data["p6"])
        : patternsArr.p1.push(0)
      item.data["p7"]
        ? patternsArr.p7.push(item.data["p7"])
        : patternsArr.p1.push(0)
      item.data["p8"]
        ? patternsArr.p8.push(item.data["p8"])
        : patternsArr.p1.push(0)
    })
    option.xAxis.data = date
    option.xAxis.boundaryGap = true
    option.xAxis.axisLabel.rotate = 45
    option.xAxis.axisLabel.formatter = function (value, index) {
      return moment(value).format("DD MMM YYYY")
    }
    option.series[0].data = patternsArr.p1
    option.series[0].name = "P1"
    option.series[0].type = "bar"
    option.series[0].stack = "stack"
    option.series[0].itemStyle.color = PATTERN_COLORS.p1
    option.series[0].markLine = {}

    option.series[1] = {}
    option.series[1].data = patternsArr.p2
    option.series[1].name = "P2"
    option.series[1].type = "bar"
    option.series[1].stack = "stack"
    option.series[1].itemStyle = {}
    option.series[1].itemStyle.color = PATTERN_COLORS.p2

    option.series[2] = {}
    option.series[2].data = patternsArr.p5
    option.series[2].name = "P5"
    option.series[2].type = "bar"
    option.series[2].stack = "stack"
    option.series[2].itemStyle = {}
    option.series[2].itemStyle.color = PATTERN_COLORS.p5

    option.series[3] = {}
    option.series[3].data = patternsArr.p3
    option.series[3].name = "P3"
    option.series[3].type = "bar"
    option.series[3].stack = "stack"
    option.series[3].itemStyle = {}
    option.series[3].itemStyle.color = PATTERN_COLORS.p3

    option.series[4] = {}
    option.series[4].data = patternsArr.p4
    option.series[4].name = "P4"
    option.series[4].type = "bar"
    option.series[4].stack = "stack"
    option.series[4].itemStyle = {}
    option.series[4].itemStyle.color = PATTERN_COLORS.p4

    option.series[5] = {}
    option.series[5].data = patternsArr.p6
    option.series[5].name = "P6"
    option.series[5].type = "bar"
    option.series[5].stack = "stack"
    option.series[5].itemStyle = {}
    option.series[5].itemStyle.color = PATTERN_COLORS.p6

    option.series[6] = {}
    option.series[6].data = patternsArr.p7
    option.series[6].name = "P7"
    option.series[6].type = "bar"
    option.series[6].stack = "stack"
    option.series[6].itemStyle = {}
    option.series[6].itemStyle.color = PATTERN_COLORS.p7

    option.series[7] = {}
    option.series[7].data = patternsArr.p8
    option.series[7].name = "P8"
    option.series[7].type = "bar"
    option.series[7].stack = "stack"
    option.series[7].itemStyle = {}
    option.series[7].itemStyle.color = PATTERN_COLORS.p8

    return option
  }

  const onChartClick = param => {
    SPCService.getKpiEventsByDate(
      {
        millId: mill.millId,
        buId: mill.buId,
        kpiId: selectedKPI.kpiId,
        pitag: selectedKPI.pitag,
        selectedDate: moment(param.name).format()
      },
      source
    ).then(
      data => {
        if (data) {
          setSpcSelectedDate(moment(param.name).format())
          setEvents(data)
          setCorrelationTable(null)
          setSelectedPattern(null)
          setCorrelationEndTime(data.endTime)
        }
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error(
            error.message || "API error, please contact Dev team to check.",
            5000
          )
        }
        console.log(error)
        return Promise.reject()
      }
    )
  }

  const getCorrelationAnalytics = () => {
    console.log(correlationStartTime)
    if (correlationDelay && correlationStartTime && spcSelectedDate) {
      const startTime = moment(
        new Date(
          new Date(spcSelectedDate).getFullYear(),
          new Date(spcSelectedDate).getMonth(),
          new Date(spcSelectedDate).getDate(),
          correlationStartTime.getHours(),
          correlationStartTime.getMinutes()
        )
      ).format()
      const delayTime = moment(correlationDelay).format("HH:mm")
      const param = {
        millId: mill.millId,
        buId: mill.buId,
        pitag: selectedKPI.pitag,
        startTime,
        endTime: correlationEndTime,
        delayTime
      }
      //Get table
      SPCService.getCorrelationAnalytics(
        {...param, type: "table"},
        source
      ).then(
        data => {
          if (data) {
            setCorrelationTable(data)
          }
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error(
              error.message || "API error, please contact Dev team to check.",
              5000
            )
          }
          console.log(error)
          return Promise.reject()
        }
      )

      //Get heatmap
      SPCService.getCorrelationAnalytics(
        {...param, type: "heatmap"},
        source
      ).then(
        data => {
          if (data) {
            setCorrelationHeatmap(data)
          }
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error(
              error.message || "API error, please contact Dev team to check.",
              5000
            )
          }
          console.log(error)
          return Promise.reject()
        }
      )
    } else {
      Alert.info("Please select Start time and Delay time")
    }
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <FilterCollapsible header="Filter by" id="kpi-event_filter">
            <Card>
              <CardBody>
                <div className="d-flex d-flex align-items-center flex-wrap">
                  <div>
                    <p className="m-0 __label">Select Process Line</p>
                    <SelectPicker
                      className="mr-3 opex-select"
                      searchable={false}
                      data={processLines}
                      labelKey="name"
                      valueKey="id"
                      placeholder="Select Process Line"
                      value={selectedProcessLines}
                      onChange={selected => setSelectedProcessLines(selected)}
                      style={{ maxWidth: 400, width: 170 }}
                    />
                  </div>
                  <div>
                    <p className="m-0 __label">Select Process</p>
                    <SelectPicker
                      className="mr-3 opex-select"
                      data={processes}
                      labelKey="name"
                      valueKey="id"
                      placeholder="Select Process"
                      value={selectedProcesses}
                      onChange={selected => setSelectedProcesses(selected)}
                      style={{ maxWidth: 400, width: 150 }}
                    />
                  </div>
                  <div>
                    <p className="m-0 __label">Select KPI</p>
                    <SelectPicker
                      className="mr-3 opex-select"
                      data={kpis}
                      labelKey="kpiName"
                      valueKey="kpiId"
                      placeholder="Select KPI"
                      value={selectedKPI ? selectedKPI.kpiId : null}
                      onSelect={(value, item) => {
                        setSelectedKPI(item)
                      }}
                      style={{ maxWidth: 400, width: 150 }}
                    />
                  </div>
                  <div>
                    <p className="m-0 __label">Select Date Range</p>
                    <DateRangePicker
                      placement="auto"
                      className="mr-3"
                      appearance="default"
                      cleanable={false}
                      value={dateRange}
                      format="DD MMM YYYY"
                      onChange={selected => setDateRange(selected)}
                      disabledDate={combine(afterToday(), allowedMaxDays(30))}
                    />
                  </div>

                  <Button
                    color="primary"
                    size="sm"
                    type="button"
                    className="btn-rounded pd-big align-self-end"
                    onClick={applyFilter}
                  >
                    Apply
                  </Button>
                </div>
              </CardBody>
            </Card>
          </FilterCollapsible>
        </div>
        <div className="__header pt-0">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="">
              {patterns && (
                <>
                  Results showing for{" "}
                  {spcSelectedDate ? (
                    <strong>
                      {moment(spcSelectedDate).format("DD MMM YYYY")}
                    </strong>
                  ) : (
                    <strong>
                      {moment(dateRange[0]).format("DD MMM YYYY")} -
                      {moment(dateRange[1]).format("DD MMM YYYY")}
                    </strong>
                  )}
                </>
              )}
            </div>
            <div className="info_box mb-0 product_square_boxes">
              <div className="mr-2">High: </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p1 }}
                />
                <span>P1</span>
              </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p2 }}
                />
                <span>P2</span>
              </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p5 }}
                />
                <span>P5</span>
              </div>
              <div className="mr-2">|</div>

              <div className="mr-2">Moderate: </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p3 }}
                />
                <span>P3</span>
              </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p4 }}
                />
                <span>P4</span>
              </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p6 }}
                />
                <span>P6</span>
              </div>
              <div className="mr-2">|</div>

              <div className="mr-2">Low: </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p7 }}
                />
                <span>P7</span>
              </div>
              <div className="__item">
                <span
                  className="__box"
                  style={{ backgroundColor: PATTERN_COLORS.p8 }}
                />
                <span>P8</span>
              </div>
            </div>
          </div>
        </div>
        <Scrollbars
          className="__content-tab"
          style={{ height: `calc(100vh - ${contentHeight}px)` }}
        >
          {patterns && (
            <Container fluid>
              <Row className="__row">
                <Col>
                  <BasicCardContainer bg="dark">
                    {patterns && (
                      <EchartOpex
                        option={patterns || {}}
                        style={{ height: "350px" }}
                        onEvents={{ click: onChartClick }}
                        chartTitle={"Patterns"}
                        chartHeader={
                          <div className="process-line-chart__header mb-2">
                            <div className="d-flex align-items-center space-arround">
                              <h2>
                                {spcSelectedKpi ? spcSelectedKpi.kpiName : ""}
                              </h2>
                            </div>
                          </div>
                        }
                      />
                    )}
                  </BasicCardContainer>
                </Col>
              </Row>
              <Row className="__row">
                {spcSelectedDate && events.events && (
                  <Col md={6} sm={12}>
                    <EventsTable
                      setSelectedPattern={setSelectedPattern}
                      data={events.events}
                      title={spcSelectedKpi ? spcSelectedKpi.kpiName : ""}
                    />
                  </Col>
                )}
                {spcSelectedDate && events.pieChart && (
                  <Col md={6} sm={12}>
                    <EventsChart
                      data={events.pieChart}
                      title={spcSelectedKpi ? spcSelectedKpi.kpiName : ""}
                    />
                  </Col>
                )}
              </Row>
              <Row className="__row">
                {spcSelectedDate && events.lineChart && (
                  <Col md={12}>
                    <SPCChart
                      selectedPattern={selectedPattern}
                      data={events.lineChart}
                      chartTitle={spcSelectedKpi ? spcSelectedKpi.kpiName : ""}
                    />
                  </Col>
                )}
              </Row>
              {spcSelectedDate && (
                <FilterCollapsible header="Correlation Analytics for Sub KPIs">
                  <Card>
                    <CardBody>
                      <div className="d-flex align-items-center flex-wrap">
                        <div>
                          <p className="m-0 __label">Start Time</p>
                          <DatePicker
                            placement="auto"
                            className="mr-3"
                            format="HH:mm"
                            value={correlationStartTime}
                            ranges={[]}
                            onChange={time => {
                              setCorrelationStartTime(time)
                            }}
                          />
                        </div>
                        <div>
                          <p className="m-0 __label">Delay</p>
                          <DatePicker
                            placement="auto"
                            className="mr-3"
                            format="HH:mm"
                            ranges={[]}
                            value={correlationDelay}
                            onChange={time => {
                              setCorrelationDelay(time)
                            }}
                          />
                        </div>
                        <Button
                          color="primary"
                          size="sm"
                          type="button"
                          className="btn-rounded pd-big align-self-end"
                          onClick={getCorrelationAnalytics}
                        >
                          Apply
                        </Button>
                      </div>
                      {correlationTable && (
                        <Correlation
                          param={{
                            millId: mill.millId,
                            buId: mill.buId,
                            pitag: selectedKPI.pitag,
                            kpiName: spcSelectedKpi.kpiName,
                            startTime: moment(
                              new Date(
                                new Date(spcSelectedDate).getFullYear(),
                                new Date(spcSelectedDate).getMonth(),
                                new Date(spcSelectedDate).getDate(),
                                correlationStartTime.getHours(),
                                correlationStartTime.getMinutes()
                              )
                            ).format(),
                            endTime: correlationEndTime
                          }}
                          correlationTable={correlationTable}
                          correlationHeatmap={correlationHeatmap}
                          isSubKpiTable={true}
                          delayTime={moment(correlationDelay).format("HH:mm")}
                        />
                      )}
                    </CardBody>
                  </Card>
                  <Row className="__row"></Row>
                </FilterCollapsible>
              )}
            </Container>
          )}
        </Scrollbars>
      </div>
    </>
  )
}
export default SPCLogsPanel
