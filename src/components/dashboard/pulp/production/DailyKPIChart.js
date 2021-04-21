import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import DashboardService from "../../../../services/dashboard.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import {
  PRODUCT_COLORS,
  CANCEL_REQUEST,
  LINE_CHART_OPTION,
  TIME_SELECT_OPTS
} from "../../../../constants"
import { useSelector } from "react-redux"
import { Alert, InputPicker } from "rsuite"
import axios from "axios"
import EchartOpex from "../../../shared/EchartOpex"

const DailyKPIChart = ({ kpiCategoryId }) => {
  const [dailyKPIChart, setDailyKPIChart] = useState(null)
  const [dailyKPIChartType, setDailyKPIChartType] = useState("line")
  const [startDate, setStartDate] = useState(TIME_SELECT_OPTS[0].value)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const mill = useSelector(state => state.appReducer.mill)
  const buildDailyKpiChart = useCallback((data, type) => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    buildChart(option, data.data, data.date, type)
    return option
  }, [])

  const fetchData = useCallback(
    source => {
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        kpiCategoryId,
        startDate: startDate,
        displayAsDate
      }
      DashboardService.getDailyKpiChartData(param, source).then(
        data => {
          setDailyKPIChart(buildDailyKpiChart(data, "line"))
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
    [buildDailyKpiChart, startDate, displayAsDate, mill, kpiCategoryId]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildChart = (option, data, date, type) => {
    if (data && date) {
      option.xAxis.data = date
      option.xAxis.boundaryGap = false
      Object.keys(data).forEach((dataName, index) => {
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: type,
          stack: "stack",
          areaStyle: {},
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[dataName]
          }
        }
      })
    }
  }

  const updateChartType = (chartData, type) => {
    const option = _.cloneDeep(chartData)
    option.series.forEach((item, index) => {
      item.type = type
    })
    if (type === "bar") {
      option.xAxis.boundaryGap = true
    } else {
      option.xAxis.boundaryGap = false
    }
    return option
  }

  const onChangeDailyKpiBarType = type => {
    setDailyKPIChartType(type)
    setDailyKPIChart(updateChartType(dailyKPIChart, type))
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <EchartOpex
          style={{ height: "250px" }}
          notMerge={true}
          option={dailyKPIChart || {}}
          chartTitle="Production"
          chartHeader={
            <div className="process-line-chart__header">
              <div className="d-flex align-items-center">
                <h2>Production</h2>
                <div className="d-flex ml-5">
                  <div
                    className="custom-control opex-radio custom-radio"
                    onClick={() => onChangeDailyKpiBarType("line")}
                  >
                    <input
                      className="custom-control-input"
                      value="line"
                      name="dailyKPIChartType"
                      type="radio"
                      checked={dailyKPIChartType === "line"}
                      onChange={() => onChangeDailyKpiBarType("line")}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadio2"
                    >
                      <span>Stack Area</span>
                    </label>
                  </div>
                  <div
                    className="custom-control opex-radio custom-radio"
                    onClick={() => onChangeDailyKpiBarType("bar")}
                  >
                    <input
                      className="custom-control-input"
                      value="bar"
                      name="dailyKPIChartType"
                      type="radio"
                      checked={dailyKPIChartType === "bar"}
                      onChange={() => onChangeDailyKpiBarType("bar")}
                    />
                    <label
                      className="custom-control-label"
                      htmlFor="customRadio1"
                    >
                      <span>Stack Bar</span>
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
          }
        />
      </BasicCardContainer>
    </>
  )
}

export default DailyKPIChart
