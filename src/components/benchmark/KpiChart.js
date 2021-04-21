import React, { useEffect, useState, useCallback } from "react"
import { Col, Row } from "reactstrap"
import BasicCardContainer from "components/shared/BasicCardContainer"
import $ from "jquery"
import BenchmarkService from "../../services/benchmark.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import { CANCEL_REQUEST, BAR_CHART_OPTION } from "../../constants/index"
import { Alert, Loader } from "rsuite"
import axios from "axios"
import ProductionHelper from "helper/production.helper"
import EchartOpex from "../shared/EchartOpex"

const KpiChart = ({ kpiId, millId, buId, frequency, startDate, endDate }) => {
  const [chart, setChart] = useState(null)
  const [mills, setMills] = useState(null)
  const [kpiMin, setKpiMin] = useState({})
  const [kpiMax, setKpiMax] = useState({})
  const [kpiName, setKpiName] = useState("")
  const [kpiUnit, setKpiUnit] = useState("")
  const buildChartOption = useCallback((data, type) => {
    const option = _.cloneDeep(BAR_CHART_OPTION)
    buildChartWithChartType(
      option,
      data.chart.data,
      data.chart.date,
      data.mills,
      type
    )
    return option
  }, [])

  const fetchData = useCallback(
    source => {
      const param = { kpiId, millId, buId, frequency, startDate, endDate }
      BenchmarkService.getKPI(param, source).then(
        data => {
          setKpiName(data.kpiName)
          setKpiUnit(data.kpiUnit)
          setMills(data.mills)
          setKpiMin(data.min)
          setKpiMax(data.max)
          setChart(buildChartOption(data, "bar"))
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
    [buildChartOption, kpiId, millId, buId, frequency, startDate, endDate]
  )

  useEffect(() => {
    const navbarH = $("#navbar-main").outerHeight()
    const mainTabItemH = $(".main-tabs-item").outerHeight()
    const mainTabContentH = $(
      ".main-tabs-content .tab-content .tab-pane.active .__header"
    ).outerHeight()
    $(".__content .scrollable").outerHeight(
      window.innerHeight - navbarH - mainTabItemH - mainTabContentH - 120
    )
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildChartWithChartType = (option, data, date, millList, type) => {
    if (data && date) {
      option.xAxis.data = date
      option.xAxis.boundaryGap = true
      option.xAxis.axisLabel = {
        formatter: function (value, index) {
          return value
        }
      }
      Object.keys(data).forEach((dataName, index) => {
        let foundMill = millList
          ? millList.filter(
              mill =>
                mill.millCode == dataName.substring(0, dataName.indexOf("-"))
            )
          : []
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: type,
          smooth: false,
          itemStyle: {
            color: foundMill.length > 0 ? foundMill[0].legendColor : ""
          }
        }
      })
    }
  }

  if (!mills || !chart) {
    return <Loader center content="Loading" />
  }

  return (
    <>
      <BasicCardContainer bg="dark numbers_chart benchmark_box">
        <div className="benchmark-chart__header">
          <div className="d-flex align-items-center">
            <h2 className="mr-3">
              {kpiName} ({kpiUnit})
            </h2>
          </div>
          <div>
            <div className="product_square_boxes">
              <div className="__item">
                <span className="__box __max"></span>
                <span>
                  Hightest Value: {kpiMax.label.join()} ({kpiMax.value})
                </span>
              </div>
            </div>
            <div className="product_square_boxes">
              <div className="__item">
                <span className="__box __min"></span>
                <span>
                  Lowest Value: {kpiMin.label.join()} ({kpiMin.value})
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="benchmark-chart__header">
          <div className="d-flex align-items-center">
            <div className="product_square_boxes">
              {mills.map((item, index) => {
                return ProductionHelper.buildMill(item, index)
              })}
            </div>
          </div>
        </div>
        <Row className="__wrapper">
          <Col md={"12"}>
            <EchartOpex
              style={{ height: "350px", width: "100%" }}
              option={chart || {}}
              chartTitle={`${kpiName} (${kpiUnit})`}
            />
          </Col>
        </Row>
      </BasicCardContainer>
    </>
  )
}

export default KpiChart
