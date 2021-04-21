import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import { LINE_CHART_OPTION, CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import { Alert, ButtonGroup, Button, Icon, Table } from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import {
  setSelectedDateOnBarChart,
  setLCAnalysisFilteredTable,
  setSelectedTypeOnPieChart
} from "../../../redux/actions/lostcook.action"
import moment from "moment"
import EchartOpex from "../../shared/EchartOpex"
const { Column, HeaderCell, Cell } = Table

const LCAnalysisBarChart = ({ params }) => {
  const [barChart, setBarChart] = useState(null)
  const [table, setTable] = useState(null)
  const [viewType, setViewType] = useState("table")
  const [title, setTitle] = useState("")
  const dispatch = useDispatch()
  const lcAnalysisTable = useSelector(
    state => state.lostcookReducer.lcAnalysisTable
  )

  const fetchData = useCallback(
    source => {
      LostcookService.getHistogramData(params, source).then(
        data => {
          setTable(buildTable(data))
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
    [params]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildBarChart = data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    if (
      data &&
      data.date &&
      data.data &&
      data.data.lc_total &&
      data.data.lc_event
    ) {
      option.xAxis.data = data.date
      option.xAxis.boundaryGap = true
      option.xAxis.axisLabel.formatter = function (value, index) {
        return moment(value).format("MMM YYYY")
      }
      option.series[0].data = data.data.lc_total
      option.series[0].name = "Total Lostcook"
      option.series[0].type = "bar"
      option.series[0].stack = "stack"
      option.series[0].itemStyle.color = "#1E90FF"
      option.series[0].markLine = {}

      option.series[1].data = data.data.lc_event
      option.series[1].name = "Total Incident"
      option.series[1].type = "bar"
      option.series[1].stack = "stack"
      option.series[1].itemStyle.color = "#EE7E30"
    }
    return option
  }

  const buildTable = data => {
    if (
      data &&
      data.data &&
      data.data.lc_event &&
      data.data.lc_total &&
      data.date
    ) {
      return data.date.map((date, index) => {
        return {
          date: date,
          lc_event: data.data.lc_event[index],
          lc_total: data.data.lc_total[index]
        }
      })
    }
    return []
  }

  const onChartClick = param => {
    dispatch(setSelectedTypeOnPieChart(null))
    dispatch(setSelectedDateOnBarChart(param.name))
    dispatch(
      setLCAnalysisFilteredTable(
        lcAnalysisTable.filter(v => {
          return param.name === moment(v.date, "MMM YYYY").format("MMM YYYY")
        })
      )
    )
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <div className="process-line-chart__header mb-2">
          <div className="d-flex align-items-center space-arround">
            <h2>{title}</h2>
          </div>
          <ButtonGroup className="opex-group-btn">
            <Button
              size="sm"
              active={viewType === "chart"}
              onClick={() => setViewType("chart")}
            >
              <Icon icon="bar-chart" />
            </Button>
            <Button
              size="sm"
              active={viewType === "table"}
              onClick={() => setViewType("table")}
            >
              <Icon icon="table" />
            </Button>
          </ButtonGroup>
        </div>
        {viewType === "chart" && (
          <EchartOpex
            option={barChart || {}}
            style={{ height: "350px" }}
            onEvents={{ click: onChartClick }}
            chartTitle={title}
          />
        )}
        {viewType === "table" && (
          <div className="">
            {table && (
              <Table
                height={375}
                data={table}
                bordered
                cellBordered
                affixHeader
                affixHorizontalScrollbar
              >
                <Column width={130} fixed resizable>
                  <HeaderCell>Date</HeaderCell>
                  <Cell dataKey="date" />
                </Column>
                <Column width={100} flexGrow>
                  <HeaderCell>Total Lostcook</HeaderCell>
                  <Cell dataKey="lc_total" />
                </Column>
                <Column minWidth={100} flexGrow>
                  <HeaderCell>Total Incident</HeaderCell>
                  <Cell dataKey="lc_event" />
                </Column>
              </Table>
            )}
          </div>
        )}
      </BasicCardContainer>
    </>
  )
}

export default LCAnalysisBarChart
