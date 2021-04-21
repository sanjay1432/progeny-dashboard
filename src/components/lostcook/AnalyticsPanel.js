import React, { useEffect, useState, useCallback } from "react"
import { Row, Col, Container } from "reactstrap"
import { Scrollbars } from "react-custom-scrollbars"
import FilterLostcook from "./FilterLostcook"
import ReactEcharts from "echarts-for-react"
import LCSearchResultTable from "./textual-analysis/LCSearchResultTable"
import { CANCEL_REQUEST, LINE_CHART_OPTION } from "../../constants"
import axios from "axios"
import { Alert, Loader } from "rsuite"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../services/lostcook.service"
import _ from "lodash"
import EchartOpex from "../shared/EchartOpex"

const AnalyticsPanel = ({ latestDate }) => {
  const [histogramArea, setHistogramArea] = useState(null)
  const [histogramResponsibility, setHistogramResponsibility] = useState(null)
  const [timeSeries, setTimeSeries] = useState(null)
  const [filterParams, setFilterParams] = useState(null)
  const [panelHeight, setPanelHeight] = useState(200)

  const fetchData = useCallback(
    source => {
      if (filterParams) {
        LostcookService.getHistogram(
          { ...filterParams, chartType: "area" },
          source
        ).then(
          data => {
            setHistogramArea(buildSearchResultChart(data, "Area"))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        LostcookService.getHistogram(
          { ...filterParams, chartType: "responsibility" },
          source
        ).then(
          data => {
            setHistogramResponsibility(
              buildSearchResultChart(data, "Responsibility")
            )
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        LostcookService.getTimeSeries(filterParams, source).then(
          data => {
            setTimeSeries(buildTimeSeriesChart(data))
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
    },
    [filterParams]
  )

  useEffect(() => {
    const height =
      Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      ) -
      Math.max(
        document.getElementById("lc-filter").clientHeight || 0,
        document.getElementById("lc-filter").innerHeight || 0
      ) -
      190
    setPanelHeight(height)
  }, [filterParams])

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildSearchResultChart = (data, chartType) => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    let rotate = 45
    if (data.lc_histogram && data.lc_histogram.length < 8) {
      rotate = 0
    }
    option.xAxis.data = data.lc_histogram
    option.xAxis.boundaryGap = true
    option.xAxis.axisLabel = {
      show: true,
      rotate: rotate,
      interval: 0,
      formatter: function (value, index) {
        return value
      }
    }
    option.series[0].data = data.data.lc_total
    option.series[0].name = chartType
    option.series[0].type = "bar"
    option.series[0].stack = "stack"
    option.series[0].itemStyle.color = "#1E90FF"
    option.series[0].markLine = {}
    option.legend = {
      show: false
    }
    return option
  }

  const buildTimeSeriesChart = data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    option.xAxis.data = data.date
    option.xAxis.boundaryGap = false
    option.series[0].data = data.data.lc_total
    option.series[0].name = "Total Lostcook"
    option.series[0].type = "line"
    option.series[0].stack = null
    option.series[0].itemStyle.color = "#1E90FF"
    option.series[0].markLine = {}

    option.series[1].data = data.data.lc_event
    option.series[1].name = "Total Incident"
    option.series[1].type = "line"
    option.series[1].stack = null
    option.series[1].itemStyle.color = "#EE7E30"
    return option
  }

  const onFilter = params => {
    setFilterParams(params)
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <FilterLostcook
            onFilter={onFilter}
            latestDate={latestDate}
            showSearchText={true}
          />
        </div>
        <Scrollbars className="__content-tab" style={{ height: panelHeight }}>
          {filterParams ? (
            <Container fluid>
              <Row className="__row">
                <Col md="12">
                  <LCSearchResultTable params={filterParams} />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="12" lg="6">
                  <BasicCardContainer bg="dark">
                    <EchartOpex
                      option={histogramArea || {}}
                      style={{ height: "350px" }}
                      chartTitle="Analytics for search result by Area"
                      chartHeader={
                        <div className="process-line-chart__header">
                          <div className="d-flex align-items-center">
                            <h2>Analytics for search result by Area</h2>
                          </div>
                        </div>
                      }
                    />
                  </BasicCardContainer>
                </Col>
                <Col md="12" lg="6">
                  <BasicCardContainer bg="dark">
                    <EchartOpex
                      option={histogramResponsibility || {}}
                      style={{ height: "350px" }}
                      chartTitle="Analytics for search result by Responsibility"
                      chartHeader={
                        <div className="process-line-chart__header">
                          <div className="d-flex align-items-center">
                            <h2>
                              Analytics for search result by Responsibility{" "}
                            </h2>
                          </div>
                        </div>
                      }
                    />
                  </BasicCardContainer>
                </Col>
              </Row>
              <Row className="__row">
                <Col md="12">
                  <BasicCardContainer bg="dark">
                    <EchartOpex
                      option={timeSeries || {}}
                      style={{ height: "350px" }}
                      chartTitle="Total Lostcook with Timeseries"
                      chartHeader={
                        <div className="process-line-chart__header">
                          <div className="d-flex align-items-center">
                            <h2>Total Lostcook with Timeseries</h2>
                          </div>
                        </div>
                      }
                    />
                  </BasicCardContainer>
                </Col>
              </Row>
            </Container>
          ) : (
            <Loader center content="Loading" />
          )}
        </Scrollbars>
      </div>
    </>
  )
}

export default AnalyticsPanel
