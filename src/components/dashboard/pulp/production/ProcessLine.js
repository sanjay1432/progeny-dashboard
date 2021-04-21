import React, { useState, useEffect, useCallback } from "react"
import { Row, Col } from "reactstrap"
import BasicCardContainer from "components/shared/BasicCardContainer"
import ProcessLineGauge from "../../../shared/ProcessLineGauge"
import { InputPicker, Alert } from "rsuite"
import {
  LINE_CHART_OPTION,
  PRODUCT_COLORS,
  TIME_SELECT_OPTS,
  FREQUENCY_SELECT_OPTS
} from "../../../../constants"
import DashboardService from "../../../../services/dashboard.service"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST } from "../../../../constants"
import axios from "axios"
import classnames from "classnames"
import _ from "lodash"
import ReactEcharts from "echarts-for-react"
import EchartOpex from "../../../shared/EchartOpex"

const ProcessLine = ({ kpiCategoryId, kpiId }) => {
  const [showPDChart, setShowPDChart] = useState(false)
  const [startDate, setStartDate] = useState(TIME_SELECT_OPTS[0].value)
  const [gaugeAndChartData, setGaugeAndChartData] = useState(null)

  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const mill = useSelector(state => state.appReducer.mill)

  const fetchData = useCallback(
    source => {
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        displayAsDate,
        kpiCategoryId,
        processLines: [],
        startDate,
        kpiId
      }
      DashboardService.getSelectProcessLineData(param, source).then(
        gaugeData => {
          DashboardService.selectedProcessLines(
            {
              type: "table",
              frequency: FREQUENCY_SELECT_OPTS[0].value,
              ...param
            },
            source
          ).then(
            data => {
              const rawDatEntry = data.columns
              const rawData = data.rows
              let chartArr = {}
              if (rawDatEntry) {
                rawDatEntry.forEach(col => {
                  if (col.id !== "date") {
                    let objData = {
                      name: col.id,
                      data: {
                        target: [],
                        value: []
                      },
                      date: []
                    }
                    rawData.forEach(row => {
                      if (
                        row[col.id].target !== null &&
                        row[col.id].value !== null
                      ) {
                        objData.data.target.push(row[col.id].target)
                        objData.data.value.push(row[col.id].value)
                        objData.date.push(row.date)
                      }
                    })
                    chartArr[col.id] = objData
                  }
                })
                const result = gaugeData.map(item => {
                  return {
                    ...item,
                    lineChartData: chartArr[item.name]
                  }
                })
                setGaugeAndChartData(result)
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
    [startDate, mill, displayAsDate, kpiCategoryId, kpiId]
  )

  const buildChart = (lineChartData, date) => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    if (lineChartData && lineChartData.data && lineChartData.date) {
      option.xAxis.data = lineChartData.date
      option.xAxis.boundaryGap = false
      option.xAxis.show = false
      option.yAxis.minInterval = 1000
      option.legend.show = false
      option.grid = {
        top: "7px",
        left: "0",
        right: "5px",
        bottom: "-40px",
        containLabel: true
      }
      Object.keys(lineChartData.data).forEach((dataName, index) => {
        let xlabel = ""
        if (dataName === "value") {
          xlabel = lineChartData.name
        } else {
          xlabel = "Target"
        }
        option.series[index] = {
          data: lineChartData.data[dataName],
          name: xlabel,
          type: "line",
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[xlabel]
          }
        }
      })
    }
    return option
  }

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  return (
    <>
      <BasicCardContainer bg="dark">
        <div className="process-line-chart__header">
          <div className="d-flex align-items-center">
            <h2>Process Lines</h2>
            <div className="d-flex ml-5">
              <div
                className="custom-control opex-radio custom-radio"
                onClick={() => setShowPDChart(false)}
              >
                <input
                  className="custom-control-input"
                  value={false}
                  name="showPDChart"
                  type="radio"
                  checked={showPDChart === false}
                  onChange={() => setShowPDChart(false)}
                />
                <label className="custom-control-label" htmlFor="customRadio2">
                  <span>Hide PDs'</span>
                </label>
              </div>
              <div
                className="custom-control opex-radio custom-radio"
                onClick={() => setShowPDChart(true)}
              >
                <input
                  className="custom-control-input"
                  value={true}
                  name="showPDChart"
                  type="radio"
                  checked={showPDChart === true}
                  onChange={() => setShowPDChart(true)}
                />
                <label className="custom-control-label" htmlFor="customRadio1">
                  <span>Show PDs'</span>
                </label>
              </div>
            </div>
          </div>
          <div>
            <InputPicker
              data={TIME_SELECT_OPTS}
              defaultValue={startDate}
              cleanable={false}
              onChange={selected => setStartDate(selected)}
            />
          </div>
        </div>
        <Row className="mb-2 process-line-gauges">
          {gaugeAndChartData &&
            gaugeAndChartData.length > 0 &&
            gaugeAndChartData.map((item, index) => {
              return (
                <Col
                  xl="3"
                  md="6"
                  key={index}
                  className={classnames("mt", {
                    "d-none":
                      item.name.toUpperCase().startsWith("PD") && !showPDChart
                  })}
                >
                  <BasicCardContainer bg="light">
                    <ProcessLineGauge gaugeChart={item} />
                    <div className="mt--4">
                      <EchartOpex
                        style={{ height: "100px" }}
                        notMerge={true}
                        option={buildChart(item.lineChartData) || {}}
                        chartTitle="Process Lines"
                      />
                    </div>
                  </BasicCardContainer>
                </Col>
              )
            })}
        </Row>
      </BasicCardContainer>
    </>
  )
}
export default ProcessLine
