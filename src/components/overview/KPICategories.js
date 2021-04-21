import React, { useEffect, useState, useCallback } from "react"
import GeneralService from "../../services/general.service"
import _ from "lodash"
import {
  PRODUCT_COLORS,
  CANCEL_REQUEST,
  LINE_CHART_OPTION
} from "../../constants/index"
import { Alert, Loader, Placeholder } from "rsuite"
import axios from "axios"
import ProductionHelper from "../../helper/production.helper"
import EchartOpex from "../shared/EchartOpex"

const KPICategories = ({ buId, millId, frequency, displayAsDate }) => {
  const [processLines, setProcessLines] = useState(null)
  const [kpis, setKpis] = useState([])

  const buildChart = chartData => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    if (chartData && chartData.data && chartData.date) {
      const data = chartData.data
      option.xAxis.data = chartData.date
      option.xAxis.boundaryGap = false

      const keyData = Object.keys(data)
      let selectedObj = {}
      keyData.forEach(item => {
        selectedObj[item] = !item.toUpperCase().startsWith("PD")
      })
      option.legend.selected = selectedObj
      Object.keys(chartData.data).forEach((dataName, index) => {
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: "line",
          stack: null,
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[dataName]
          }
        }
      })
    }
    return option
  }

  const fetchData = useCallback(
    source => {
      GeneralService.getKpiProcessLineByKpiCategory(
        {
          buId,
          millId,
          frequency,
          displayAsDate
        },
        source
      ).then(
        data => {
          setKpis(data)
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
    [buId, millId, frequency, displayAsDate]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    GeneralService.getAllProcessLines({ buId, millId }, source).then(
      data => {
        setProcessLines(data)
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error("We got an unknown error.", 5000)
        }
        console.log(error)
        return Promise.reject()
      }
    )
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [buId, millId])

  if (!processLines) {
    return <Loader center content="Loading" />
  }

  if (!frequency) {
    return <Placeholder.Paragraph rows={20} />
  }

  return (
    <>
      <div>
        <div className="processline_select">
          <div className="product_square_boxes mb-2">
            {processLines &&
              processLines
                .filter(
                  item => !item.processLineCode.toUpperCase().startsWith("PD")
                )
                .map((item, index) => {
                  return ProductionHelper.buildProcessLine(item, index)
                })}
          </div>
        </div>
        {kpis &&
          kpis.map((kpi, index) => {
            return (
              <div key={index} className="kpi-chart">
                <EchartOpex
                  chartTitle={kpi.kpiName}
                  style={{ height: "200px", width: "100%" }}
                  option={buildChart(kpi.dataset) || {}}
                  chartHeader={<p>{kpi.kpiName}</p>}
                />
              </div>
            )
          })}
      </div>
    </>
  )
}

export default KPICategories
