import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import CIService from "../../../services/ci.service"
import { CANCEL_REQUEST, LINE_CHART_OPTION } from "../../../constants"
import _ from "lodash"
import ReactEcharts from "echarts-for-react"

import { Alert, Table } from "rsuite"
import moment from "moment"
import axios from "axios"
import EchartOpex from "../../shared/EchartOpex"
const { Column, HeaderCell, Cell } = Table

const SummaryDetailPanel = ({ Kpi, Periods }) => {
  const [tableData, setTableData] = useState(null)

  const fetchData = useCallback(
    source => {
      if (Kpi && Periods && Periods.length > 0) {
        let Id = Kpi.kpiId
        CIService.getKPIDetail({ param: { Id, Periods } }, source).then(
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
    [Kpi, Periods]
  )

  const buildLineChart = data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    option.xAxis.data = data.date
    option.xAxis.boundaryGap = true
    option.xAxis.axisLabel = {
      formatter: function (value, index) {
        return value
      }
    }
    option.series[0].data = data.data.lc_event
    option.series[0].name = "Histogram"
    option.series[0].type = "line"
    option.series[0].stack = "stack"
    option.series[0].itemStyle.color = "#1E90FF"
    option.series[0].markLine = {}
    option.legend = {
      show: false
    }
    return option
  }

  // const buildBoxPlotChart = (value) => {
  //     const data = echarts.dataTool.prepareBoxplotData(value)
  //     const option = {
  //         tooltip: {
  //             trigger: 'item',
  //             axisPointer: {
  //                 type: 'shadow'
  //             }
  //         },
  //         grid: {
  //             left: '10%',
  //             right: '10%',
  //             bottom: '15%'
  //         },
  //         xAxis: {
  //             type: 'category',
  //             data: data.axisData,
  //             boundaryGap: true,
  //             nameGap: 30,
  //             splitArea: {
  //                 show: false
  //             },
  //             axisLabel: {
  //                 formatter: 'expr {value}'
  //             },
  //             splitLine: {
  //                 show: false
  //             }
  //         },
  //         yAxis: {
  //             type: 'value',
  //             name: 'km/s minus 299,000',
  //             splitArea: {
  //                 show: true
  //             }
  //         },
  //         series: [
  //             {
  //                 name: 'boxplot',
  //                 type: 'boxplot',
  //                 data: data.boxData,
  //                 tooltip: {
  //                     formatter: function (param) {
  //                         return [
  //                             //'Experiment ' + param.name + ': ',
  //                             //'upper: ' + param.data[5],
  //                             'Q3: ' + param.data[4],
  //                             'median: ' + param.data[3],
  //                             'Q1: ' + param.data[2],
  //                             //'lower: ' + param.data[1]
  //                         ].join('<br/>');
  //                     }
  //                 }
  //             },
  //             {
  //                 name: 'outlier',
  //                 type: 'scatter',
  //                 data: data.outliers
  //             }
  //         ]
  //     };
  //
  //     // option.xAxis.data = data.date;
  //     // option.xAxis.boundaryGap = true
  //     // option.xAxis.axisLabel = {
  //     //     formatter: function (value, index) {
  //     //         return value
  //     //     }
  //     // }
  //     // option.series[0].data = data.data.lc_event;
  //     // option.series[0].name = 'Histogram';
  //     // option.series[0].type = 'line';
  //     // option.series[0].stack = 'stack';
  //     // option.series[0].itemStyle.color = '#1E90FF'
  //     // option.series[0].markLine = {}
  //     // option.legend = {
  //     //     show: false
  //     // }
  //     return option;
  // }

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
      rowLineChart[label] = item.data.lineChartData
      rowBoxPlotChart[label] = item.data.boxplotChartData
    })
    console.log([
      rowMax,
      rowMin,
      rowAverage,
      rowTotal,
      rowDaily,
      rowCpk,
      rowLineChart,
      rowBoxPlotChart
    ])
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
            option={buildLineChart(rowData[dataKey]) || {}}
            style={{ height: "350px" }}
            chartTitle="Histogram"
          />
        </Cell>
      )
      // } else if(rowData.name === "Box Plot"){
      //     return (
      //         <Cell {...props}>
      //             <ReactEcharts option={buildBoxPlotChart(rowData[dataKey]) || {}} style={{ height: '350px' }} />
      //         </Cell>
      //       );
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
                  console.log(rowData)
                  if (rowData.name === "Time Series") {
                    return 500
                  } else {
                    return 46
                  }
                }}
              >
                {Object.keys(tableData[0]).map((item, index) => {
                  console.log("------", item)
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
          {/* : <Loader center content="Loading" />} */}
        </div>
      </BasicCardContainer>
    </>
  )
}

export default SummaryDetailPanel
