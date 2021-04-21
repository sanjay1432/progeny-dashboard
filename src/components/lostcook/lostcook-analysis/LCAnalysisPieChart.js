import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import { CANCEL_REQUEST } from "../../../constants"
import axios from "axios"
import { Alert } from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import {
  setSelectedTypeOnPieChart,
  setLCAnalysisFilteredTable,
  setSelectedDateOnBarChart
} from "../../../redux/actions/lostcook.action"
import EchartOpex from "../../shared/EchartOpex"

const AREA_AND_RESPONSIBILITY_COLORS = {
  wash: "#1A1334",
  chip: "#27294A",
  bleach: "#00545A",
  rpe: "#027351",
  pulpDryer: "#02C383",
  project: "#AAD962",
  dig: "#FBBF45",
  chemical: "#EF6A32",
  rke: "#ED0345",
  mechanical: "#A12A5D",
  plc: "#710162",
  processWY: "#110141",
  instrument: "#2C4C00",
  maintenanceWY: "#3C1452",
  hydraulic: "#9933CC",
  dcs: "#017299",
  engineering: "#0199CC",
  electrical: "#33B5E5",
  civil: "#E50072",
  plcInstrumentSp: "#FF3398",
  process: "#2E72FB"
}

const PIE_CHART_OPTION = {
  tooltip: {
    trigger: "item",
    formatter: "<b>{a}</b> <br/><b>{b}</b> <br/> Value: {c}"
  },
  legend: {
    type: "scroll",
    orient: "vertical",
    right: 0,
    top: 20,
    bottom: 20
  },
  series: [
    {
      name: "",
      type: "pie",
      radius: ["0", "80%"],
      avoidLabelOverlap: false,
      data: [],
      legendHoverLink: false,
      label: {
        show: false
      },
      left: "-40%",
      selectedMode: "single"
    }
  ]
}

const LCAnalysisPieChart = ({ params }) => {
  const [pieChart, setPieChart] = useState(null)
  const [chartType, setChartType] = useState("responsibility")
  const dispatch = useDispatch()
  const lcAnalysisTable = useSelector(
    state => state.lostcookReducer.lcAnalysisTable
  )

  const fetchData = useCallback(
    source => {
      LostcookService.getlcAnalysisPieChart(
        { ...params, chartType },
        source
      ).then(
        data => {
          setPieChart(buildPieChart(data, chartType))
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

  const buildPieChart = (data, typeOfChart) => {
    const option = _.cloneDeep(PIE_CHART_OPTION)

    const sumArr = _.sumBy(data, function (item) {
      return Number.parseFloat(item.value)
    })
    const legendData = data.map(item => {
      const percentage = Number.parseFloat(
        (Number.parseFloat(item.value) * 100) / sumArr
      ).toFixed(2)
      return {
        name: `${item.name} ${percentage}%`,
        value: item.value,
        realLabel: item.name,
        itemStyle: {
          color: AREA_AND_RESPONSIBILITY_COLORS[item.id]
        }
      }
    })
    option.series[0].data = legendData
    option.legend.data = legendData
    if (typeOfChart === "area") {
      option.series[0].name = "Area breakdown"
    } else {
      option.series[0].name = "Responsibility breakdown"
    }
    return option
  }

  const onChangeChartType = type => {
    setChartType(type)
  }
  const onChartClick = param => {
    dispatch(setSelectedDateOnBarChart(null))
    dispatch(
      setSelectedTypeOnPieChart({ chartType, label: param.data.realLabel })
    )
    dispatch(
      setLCAnalysisFilteredTable(
        lcAnalysisTable.filter(v => {
          return param.data.realLabel === v[chartType]
        })
      )
    )
  }

  return (
    <>
      <BasicCardContainer bg="dark">
        <EchartOpex
          chartTitle="Lostcook based on"
          notMerge={true}
          option={pieChart || {}}
          style={{ height: "350px" }}
          onEvents={{ click: onChartClick }}
          chartHeader={
            <>
              <div className="process-line-chart__header">
                <div className="d-flex align-items-center">
                  <h2>Lostcook based on</h2>
                </div>
              </div>
              <div className="d-flex ml-2 mt-2 mb-2">
                <div
                  className="custom-control opex-radio custom-radio"
                  onClick={() => onChangeChartType("responsibility")}
                >
                  <input
                    className="custom-control-input"
                    value="responsibility"
                    name="dailyKPIChartType"
                    type="radio"
                    checked={chartType === "responsibility"}
                    onChange={() => onChangeChartType("responsibility")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio1"
                  >
                    <span> Responsibility</span>
                  </label>
                </div>
                <div
                  className="custom-control opex-radio custom-radio"
                  onClick={() => onChangeChartType("area")}
                >
                  <input
                    className="custom-control-input"
                    value="area"
                    name="dailyKPIChartType"
                    type="radio"
                    checked={chartType === "area"}
                    onChange={() => onChangeChartType("area")}
                  />
                  <label
                    className="custom-control-label"
                    htmlFor="customRadio2"
                  >
                    <span>Area</span>
                  </label>
                </div>
              </div>
            </>
          }
        />
      </BasicCardContainer>
    </>
  )
}

export default LCAnalysisPieChart
