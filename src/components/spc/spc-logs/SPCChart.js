import React, { useEffect, useState } from "react"
import _ from "lodash"
import BasicCardContainer from "../../shared/BasicCardContainer"
import EchartOpex from "../../shared/EchartOpex"
import GeneralHelper from "../../../helper/general.helper"

const PIE_CHART_OPTION = {
  legend: null,
  grid: {
    top: "30px",
    left: "1%",
    right: "30px",
    bottom: "0px",
    containLabel: true
  },
  xAxis: {
    type: "category",
    data: []
  },
  dataZoom: [
    {
      show: true,
      realtime: true,
      start: 0,
      end: 100
    }
  ],
  yAxis: {},
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow"
    },
    textStyle: {
      fontSize: 12
    }
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      markLine: {
        data: [
          {
            name: "L1 Sigma: ",
            yAxis: 120
          },
          {
            name: "L2 Sigma: ",
            yAxis: 400
          },
          {
            name: "LCL: ",
            yAxis: 230
          },
          {
            name: "Mean: ",
            yAxis: 123,
            lineStyle: {
              color: "#40CE1E",
              width: 2,
              type: "solid"
            }
          },
          {
            name: "U1 Sigma: ",
            yAxis: 544
          },
          {
            name: "U2 Sigma: ",
            yAxis: 231
          },
          {
            name: "UCL: ",
            yAxis: 542
          }
        ],
        lineStyle: {
          color: "#D94745"
        },
        symbol: "none",
        label: {
          show: false,
          position: "insideEndTop",
          formatter: "{b}: {c}"
        }
      },
      lineStyle: {
        color: "#3979EF"
      },
      itemStyle: {
        color: "#3979EF"
      }
    }
  ]
}
const SPCChart = ({ data, chartTitle, selectedPattern }) => {
  const [spcChartOption, setSPCChartOption] = useState(null)
  useEffect(() => {
    if (data) {
      const { time, value, kpiStats } = data
      const option = _.cloneDeep(PIE_CHART_OPTION)
      option.xAxis.data = time
      option.tooltip.formatter = params => {
        let txt = ""
        if (params.componentType === "series") {
          txt = `<strong>${params.name}</strong> </br>
                  </br>
                  <strong>Data: ${params.value}</strong></br>
                  L1 Sigma: ${kpiStats.l1sigma}</br>
                  L2 sigma: ${kpiStats.l2sigma}</br>
                  LCL: ${kpiStats.lcl}</br>
                  Mean: ${kpiStats.mean}</br>
                  U1 Sigma: ${kpiStats.u1sigma}</br>
                  U2 Sigma: ${kpiStats.u2sigma}</br>
                  UCL: ${kpiStats.ucl}</br>
                  `
        } else {
          txt = `<strong>${params.name} ${params.value}</strong> </br>`
        }
        return txt
      }
      option.series[0].data = value
      option.series[0].markLine.data[0].yAxis = kpiStats.l1sigma
      option.series[0].markLine.data[1].yAxis = kpiStats.l2sigma
      option.series[0].markLine.data[2].yAxis = kpiStats.lcl
      option.series[0].markLine.data[3].yAxis = kpiStats.mean
      option.series[0].markLine.data[4].yAxis = kpiStats.u1sigma
      option.series[0].markLine.data[5].yAxis = kpiStats.u2sigma
      option.series[0].markLine.data[6].yAxis = kpiStats.ucl
      setSPCChartOption(option)
    }
  }, [data])

  useEffect(() => {
    if (
      selectedPattern &&
      selectedPattern.times &&
      selectedPattern.pattern &&
      spcChartOption
    ) {
      const option = _.cloneDeep(spcChartOption)
      const time = option.xAxis.data
      const selectedTimes = selectedPattern.times
      const color = GeneralHelper.getColorOfPattern(
        selectedPattern.pattern.toLowerCase()
      )
      const pieces = []
      selectedTimes.forEach(item => {
        pieces.push({
          gt: time.indexOf(item.startTime),
          lt: time.indexOf(item.endTime),
          color: color
        })
      })
      option.visualMap = {
        type: "piecewise",
        show: false,
        dimension: 0,
        seriesIndex: 0
      }
      option.series[0].areaStyle = {}
      option.visualMap.pieces = pieces
      setSPCChartOption(option)
    }
  }, [selectedPattern])
  return (
    <BasicCardContainer bg="dark">
      <EchartOpex
        chartTitle={chartTitle}
        notMerge={true}
        option={spcChartOption || {}}
        style={{ height: "350px" }}
        chartHeader={
          <div className="d-flex align-items-center flex-wrap">
            <h2>
              {chartTitle}{" "}
              {selectedPattern && selectedPattern.pattern && (
                <strong> | Selected Pattern: {selectedPattern.pattern}</strong>
              )}
            </h2>
          </div>
        }
      />
    </BasicCardContainer>
  )
}

export default SPCChart
