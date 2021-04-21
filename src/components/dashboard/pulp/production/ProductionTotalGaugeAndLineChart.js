import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import DashboardService from "../../../../services/dashboard.service"
import ReactEcharts from "echarts-for-react"
import { Col } from "reactstrap"
import _ from "lodash"
import { useSelector } from "react-redux"
import { LINE_CHART_OPTION, CANCEL_REQUEST } from "../../../../constants"
import { Alert } from "rsuite"
import axios from "axios"
import GeneralHelper from "../../../../helper/general.helper"
import EchartOpex from "../../../shared/EchartOpex"

const ProductionTotalGaugeAndLineChart = ({ kpiCategoryId, kpiId, type }) => {
  const [productionKP, setProductionKP] = useState(null)
  const [targetProcessLineKP, setTargetProcessLineKP] = useState(null)
  const [annualTargetKP, setAnnualTargetKP] = useState(null)

  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )

  const getProductionData = useCallback(
    source => {
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        displayAsDate,
        kpiCategoryId,
        kpiId
      }
      DashboardService.getProductionTotal({ type, ...param }, source).then(
        data => {
          setProductionKP(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      DashboardService.getTargetProcessLine({ type, ...param }, source).then(
        data => {
          setTargetProcessLineKP(buildTargetProcessLineChart(data))
          setAnnualTargetKP(data.annualTarget)
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
    [mill.buId, displayAsDate, kpiCategoryId, kpiId, mill.millId, type]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    getProductionData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [getProductionData])

  const buildTargetProcessLineChart = data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    option.xAxis.data = data.date
    option.series[0].name = "Actual"
    option.series[0].data = data.data.actual
    option.series[1].data = data.data.target
    option.series[1].name = "Target"
    option.grid = {
      top: "30px",
      left: "20px",
      right: "20px",
      bottom: "0px",
      containLabel: true
    }
    option.dataZoom = [
      {
        type: "slider",
        realtime: true,
        borderColor: "rgba(235, 235, 235, 0.83)",
        fillerColor: "rgba(183, 200, 251, 0.2)",
        bottom: -1
      }
    ]
    return option
  }

  return (
    <>
      <Col md={4}>
        <BasicCardContainer bg="dark">
          {productionKP && (
            <>
              <h2>{productionKP.name}</h2>
              <div className="gauge_chart">
                {GeneralHelper.buildGaugeChart({
                  min: Number.parseInt(productionKP.minValue),
                  value: Number.parseFloat(
                    Number.parseFloat(productionKP.value).toFixed(0)
                  ),
                  threshold: Number.parseInt(productionKP.threshold),
                  max: Number.parseInt(productionKP.maxValue)
                })}
              </div>
            </>
          )}
        </BasicCardContainer>
      </Col>
      <Col md={8}>
        <BasicCardContainer bg="dark">
          <EchartOpex
            style={{ height: "200px" }}
            notMerge={true}
            option={targetProcessLineKP || {}}
            chartTitle="Production"
            chartHeader={
              <div className="process-line-chart__header">
                <span>
                  Annual Target: <strong>{annualTargetKP}</strong>
                </span>
                <div className="__title">
                  <span>
                    Production (<strong className="actual">Actual</strong> vs{" "}
                    <strong className="target">Target</strong>) (ADt)
                  </span>
                </div>
              </div>
            }
          />
        </BasicCardContainer>
      </Col>
    </>
  )
}

export default ProductionTotalGaugeAndLineChart
