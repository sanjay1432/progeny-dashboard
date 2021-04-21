import React, { useEffect, useState, useCallback } from "react"
import { Button, Col, Row } from "reactstrap"
import BasicCardContainer from "components/shared/BasicCardContainer"
import DashboardService from "../../services/dashboard.service"
import _ from "lodash"
import {
  PRODUCT_COLORS,
  CANCEL_REQUEST,
  LINE_CHART_OPTION
} from "../../constants/index"
import { Alert, Loader, Tooltip, Whisper } from "rsuite"
import axios from "axios"
import ProductionHelper from "helper/production.helper"
import classnames from "classnames"
import ChartWithAnnotation from "./ChartWithAnnotation"

const NumberCardsAndChart = ({ filterParams }) => {
  const [showTable, setShowTable] = useState(true)
  const [chart, setChart] = useState(null)
  const [processLines, setProcessLines] = useState(null)
  const [kpiName, setKpiName] = useState("")
  const [kpiUnit, setKpiUnit] = useState("")
  const [annotations, setAnnotations] = useState(null)

  const buildChartOption = useCallback((data, type) => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    buildChartWithChartType(option, data.data, data.date, type)
    return option
  }, [])

  const fetchData = useCallback(
    source => {
      DashboardService.getConsumptionKpiData(filterParams, source).then(
        data => {
          setKpiName(data.kpiName)
          setKpiUnit(data.kpiUnit)
          setAnnotations(data.annotationDates)
          setChart(buildChartOption(data.chart, "line"))
          setProcessLines(data.processLines)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
    },
    [buildChartOption, filterParams]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildChartWithChartType = (option, data, date, type) => {
    if (data && date) {
      option.xAxis.data = date
      option.xAxis.boundaryGap = false
      Object.keys(data).forEach((dataName, index) => {
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: type,
          stack: null,
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[dataName]
          }
        }
      })
    }
  }

  if (!processLines || !chart) {
    return <Loader center content="Loading" />
  }

  return (
    <>
      <BasicCardContainer bg="dark numbers_chart">
        <div className="process-line-chart__header">
          <div className="d-flex align-items-center">
            <h2 className="mr-3">
              {kpiName} ({kpiUnit})
            </h2>
            <div className="product_square_boxes">
              {processLines &&
                processLines.map((item, index) => {
                  return ProductionHelper.buildProcessLine(item, index)
                })}
            </div>
          </div>
          {/*<div>*/}
          {/*    <Button color="primary" size="sm" type="button" className="btn-rounded pd-big">Full report</Button>*/}
          {/*</div>*/}
        </div>
        <Row className="__wrapper">
          <Col xl={showTable ? "4" : "5"} md={showTable ? "5" : "12"}>
            <div className="__numbers_left">
              <div className={classnames("__numbers", { __table: showTable })}>
                {showTable && (
                  <div className="__table">
                    <div className="__number">
                      <h2> </h2>
                      <h1 className="text-default">Today</h1>
                      <h3 className="text-bold">30days</h3>
                    </div>
                  </div>
                )}
                {processLines &&
                  processLines.map((item, index) => {
                    const todayDirection = item.todayDirection || ""
                    const todayColor = item.todayColor || ""
                    const monthlyAvgDirection = item.monthlyAvgDirection || ""
                    const monthlyAvgColor = item.monthlyAvgColor || ""
                    return (
                      <div
                        className="__number"
                        key={`__number${filterParams.kpiId}-${index}`}
                      >
                        <h2>{item.processLineCode}</h2>
                        <Whisper
                          placement="bottom"
                          speaker={
                            <Tooltip>
                              <ul>
                                <li>
                                  <span>Actual:</span>
                                  <span>{item.todayValue}</span>
                                </li>
                                <li>
                                  <span>Target:</span>
                                  <span>{item.threshold}</span>
                                </li>
                                <li>
                                  <span>Diff:</span>
                                  <span>{`${item.todayDiff} (${item.todayPercentageDiff}%)`}</span>
                                </li>
                                <li>
                                  <span>MSR:</span>
                                  <span>{item.todayMsr}</span>
                                </li>
                              </ul>
                            </Tooltip>
                          }
                        >
                          <h1 className={todayColor}>
                            {item.todayValue}{" "}
                            <i className={`fa fa-caret-${todayDirection}`} />
                          </h1>
                        </Whisper>
                        <Whisper
                          placement="bottom"
                          speaker={
                            <Tooltip>
                              <ul>
                                <li>
                                  <span>Actual:</span>
                                  <span>{item.monthlyAvgValue}</span>
                                </li>
                                <li>
                                  <span>Target:</span>
                                  <span>{item.threshold}</span>
                                </li>
                                <li>
                                  <span>Diff:</span>
                                  <span>{`${item.monthlyDiff} (${item.monthlyPercentageDiff}%)`}</span>
                                </li>
                              </ul>
                            </Tooltip>
                          }
                        >
                          <h3 className={monthlyAvgColor}>
                            [{item.monthlyAvgValue}]{" "}
                            <i
                              className={`fa fa-caret-${monthlyAvgDirection}`}
                            />
                          </h3>
                        </Whisper>
                      </div>
                    )
                  })}
              </div>
              <Button
                color="primary"
                size="sm"
                type="button"
                className="btn-circle"
                onClick={() => setShowTable(!showTable)}
              >
                <i
                  className={`fa fa-angle-double-${
                    showTable ? "right" : "left"
                  }`}
                  aria-hidden="true"
                />
              </Button>
            </div>
          </Col>
          <Col xl={showTable ? "8" : "7"} md={showTable ? "7" : "12"}>
            <ChartWithAnnotation
              chartTitle={`${kpiName} (${kpiUnit})`}
              annotations={annotations}
              buId={filterParams.buId}
              kpiId={filterParams.kpiId}
              millId={filterParams.millId}
              chartOptions={chart}
              processLines={processLines}
            />
          </Col>
        </Row>
      </BasicCardContainer>
    </>
  )
}

export default NumberCardsAndChart
