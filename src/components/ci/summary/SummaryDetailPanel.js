import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import CIService from "../../../services/ci.service"
import {
  CANCEL_REQUEST,
  LINE_CHART_OPTION,
  BOX_PLOT_CHART_OPTION
} from "../../../constants"
import _ from "lodash"
import { prepareBoxplotData } from "echarts/extension/dataTool"

import { Alert, Table } from "rsuite"
import moment from "moment"
import axios from "axios"
import EchartOpex from "../../shared/EchartOpex"
const { Column, HeaderCell, Cell } = Table

const SummaryDetailPanel = ({
  Kpi,
  Periods,
  dateRanges,
  processLine,
  millId,
  buId
}) => {
  const [tableData, setTableData] = useState(null)
  const fetchData = useCallback(
    source => {
      if (Kpi && Periods && Periods.length > 0) {
        const param = {
          kpiId: Kpi.kpiId,
          dateRanges,
          processLine,
          millId,
          buId
        }
        CIService.getKPIDetail(param, source).then(
          data => {
            setTableData(buildTableData(data))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            setTableData(null)
            return Promise.reject()
          }
        )
      } else setTableData(null)
    },
    [Kpi, Periods, buId, dateRanges, millId, processLine]
  )

  const buiMinMax = rowDataObject => {
    let min = 0
    let max = 0
    Object.keys(rowDataObject).forEach(item => {
      let itemData = rowDataObject[item]
      if (itemData.max > max) {
        max = itemData.max
      }
      if (itemData.min < min) {
        min = itemData.min
      }
    })
    return {
      min,
      max
    }
  }

  const buildLineChart = (rowData, dataKey) => {
    const minMax = buiMinMax(rowData)
    const option = _.cloneDeep(LINE_CHART_OPTION)
    const data = rowData[dataKey]
    option.xAxis.data = data.date
    option.xAxis.boundaryGap = false
    option.xAxis.axisLabel = {
      formatter: function (value, index) {
        return value
      }
    }
    option.xAxis.splitLine = {
      show: true,
      lineStyle: {
        color: "#EAF0F4"
      }
    }
    option.yAxis.axisTick.show = true
    option.yAxis.axisLine.show = true
    option.yAxis.splitLine = { show: false }
    option.yAxis.min = minMax.min
    option.yAxis.max = minMax.max
    option.series[0].data = data.data
    option.series[0].smooth = true
    option.series[0].name = "Histogram"
    option.series[0].type = "line"
    option.series[0].stack = "stack"
    option.series[0].itemStyle.color = "#9de7a5"
    option.series[0].markLine = {}
    option.legend = {
      show: false
    }
    return option
  }

  const buildBoxPlotChart = (rowData, dataKey) => {
    const minMax = buiMinMax(rowData)
    const value = rowData[dataKey]
    const data = prepareBoxplotData(value && value[0] ? value[0].data : null)
    const option = _.cloneDeep(BOX_PLOT_CHART_OPTION)
    option.xAxis.data = data.axisData
    option.xAxis.axisLine.show = false
    option.xAxis.axisLabel.show = false
    option.yAxis.min = minMax.min
    option.yAxis.max = minMax.max
    option.series[0].data = data.boxData
    option.series[0].tooltip = {
      formatter: function (param) {
        return [
          '<span style="font-size: 0.75rem">' +
            value[0].date[param.dataIndex] +
            "</span>",
          '<span style="font-size: 0.75rem">Q3: ' + param.data[4] + "</span>",
          '<span style="font-size: 0.75rem">Median: ' +
            param.data[3] +
            "</span>",
          '<span style="font-size: 0.75rem">Q1: ' + param.data[2] + "</span>"
        ].join("<br/>")
      }
    }
    return option
  }

  const buildTableData = (data = []) => {
    setTableData(null)

    let rowMax = {
      name: "Max"
    }
    let rowMin = {
      name: "Min"
    }
    let rowAverage = {
      name: "Average"
    }
    let rowTotal = {
      name: "Total Consumption"
    }
    let rowDaily = {
      name: "Daily Standard Deviation"
    }
    let rowCpk = {
      name: "Cpk"
    }
    let rowLineChart = {
      name: "Time Series"
    }
    let rowBoxPlotChart = {
      name: "Box Plot"
    }
    data.forEach(item => {
      let label = `${moment(item.dateRange.startDate).format(
        "DD MMM YYYY"
      )} to ${moment(item.dateRange.endDate).format("DD MMM YYYY")} (${
        moment(item.dateRange.endDate).diff(
          moment(item.dateRange.startDate),
          "days"
        ) + 1
      } days)`
      rowMax[label] = item.data.max
      rowMin[label] = item.data.min
      rowAverage[label] = item.data.average
      rowTotal[label] = item.data.total
      rowDaily[label] = item.data.dailyStdDeviation
      rowCpk[label] = item.data.weeklyStdDeviation
      rowLineChart[label] = {
        ...item.data.lineChartData,
        min: item.data.min,
        max: item.data.max
      }
      rowBoxPlotChart[label] = {
        ...item.data.boxplotChartData,
        min: item.data.min,
        max: item.data.max
      }
    })
    return [
      rowMax,
      rowMin,
      rowAverage,
      rowTotal,
      rowDaily,
      rowCpk,
      rowLineChart,
      rowBoxPlotChart
    ]
  }

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const NameCell = ({ rowData, dataKey, ...props }) => {
    if (rowData.name === "Time Series") {
      return (
        <Cell {...props}>
          <EchartOpex
            option={buildLineChart(rowData, dataKey) || {}}
            style={{ height: 300 }}
            chartTitle="Time Series"
          />
        </Cell>
      )
    } else if (rowData.name === "Box Plot") {
      return (
        <Cell {...props}>
          <EchartOpex
            option={buildBoxPlotChart(rowData, dataKey) || {}}
            style={{ height: "350px" }}
            chartTitle="Box Plot"
          />
        </Cell>
      )
    } else {
      return <Cell {...props}>{rowData[dataKey]}</Cell>
    }
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <div>
          {tableData ? (
            <div>
              <Table
                height={420}
                data={tableData}
                bordered
                cellBordered
                affixHeader
                autoHeight
                affixHorizontalScrollbar
                rowHeight={rowData => {
                  if (rowData.name === "Time Series") {
                    return 380
                  } else if (rowData.name === "Box Plot") {
                    return 380
                  } else {
                    return 46
                  }
                }}
              >
                {Object.keys(tableData[0]).map((item, index) => {
                  if (item === "name") {
                    return (
                      <Column key={index} width={270} fixed resizable>
                        <HeaderCell>{Kpi.kpiName}</HeaderCell>
                        <Cell dataKey="name" />
                      </Column>
                    )
                  } else {
                    return (
                      <Column key={index} width={500} resizable>
                        <HeaderCell>{item}</HeaderCell>
                        <NameCell dataKey={item} />
                      </Column>
                    )
                  }
                })}
              </Table>
            </div>
          ) : (
            ""
          )}
        </div>
      </BasicCardContainer>
    </>
  )
}

export default SummaryDetailPanel
