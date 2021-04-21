import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import { CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import { Alert } from "rsuite"
import EchartOpex from "../../shared/EchartOpex"

const PARETO_CHART_OPTION = {
  tooltip: {
    trigger: "axis",
    formatter: "<strong>{b0}</strong><br/>{a0}: {c0}<br/>{a1}: {c1}%",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#999"
      }
    }
  },
  grid: {
    top: "30px",
    left: "20px",
    right: "20px",
    bottom: "0px",
    containLabel: true
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 30
    },
    {
      type: "inside",
      realtime: true,
      start: 0,
      end: 30
    }
  ],
  xAxis: [
    {
      type: "category",
      boundaryGap: true,
      data: [],
      axisLabel: {
        show: true,
        rotate: 45,
        interval: 0,
        margin: 5,
        fontSize: 10
      },
      axisTick: {
        alignWithLabel: true
      }
    }
  ],
  yAxis: [
    {
      type: "value",
      min: 0,
      splitNumber: 5
    },
    {
      type: "value",
      splitNumber: 5,
      min: 0,
      max: 100,
      axisLabel: {
        color: "red",
        formatter: function (value) {
          return value + "%"
        }
      }
    }
  ],
  series: [
    {
      name: "Problem",
      type: "bar",
      xAxisIndex: 0,
      yAxisIndex: 0,
      itemStyle: {
        color: "blue"
      },
      data: []
    },
    {
      name: "Percentage",
      yAxisIndex: 1,
      itemStyle: {
        color: "red"
      },
      data: [],
      type: "line",
      smooth: true
    }
  ]
}

const LCAnalysisParetoChart = ({ params, chartType, name, subTitle }) => {
  const [barChart, setBarChart] = useState(null)
  const [title, setTitle] = useState("")
  const fetchData = useCallback(
    source => {
      LostcookService.paretoChart({ ...params, chartType }, source).then(
        data => {
          setBarChart(buildBarChart(data))
          setTitle(data.chartTitle)
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
    [params, chartType]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  // Histogram options
  const buildBarChart = data => {
    const option = _.cloneDeep(PARETO_CHART_OPTION)
    if (data && data.data) {
      option.xAxis[0].data = data.lc_problem || []
      option.series[0].data = data.data.lc_total || []
      option.series[0].name = name || "Problem"
      option.series[1].data = data.data.lc_percentage || []
      if (subTitle) {
        option.tooltip.formatter =
          "<strong>{b0}</strong><br/>{a0}: {c0} " +
          subTitle +
          "<br/>{a1}: {c1}%"
      }
    }
    return option
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <EchartOpex
          option={barChart || {}}
          style={{ height: 400 }}
          chartTitle={title}
          chartHeader={
            <div className="process-line-chart__header">
              <div className="d-flex align-items-center">
                <h2>{title}</h2>
              </div>
            </div>
          }
        />
      </BasicCardContainer>
    </>
  )
}

export default LCAnalysisParetoChart
