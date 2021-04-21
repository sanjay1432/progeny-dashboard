import React, { useEffect, useState, useCallback } from "react"
import { Row, Col, Button } from "reactstrap"
import BasicCardContainer from "components/shared/BasicCardContainer"
import LostcookService from "../../../services/lostcook.service"
import ReactEcharts from "echarts-for-react"
import _ from "lodash"
import { Toggle, Alert } from "rsuite"
import {
  LINE_CHART_OPTION,
  PRODUCT_COLORS,
  CANCEL_REQUEST
} from "../../../constants/index"
import axios from "axios"
import classnames from "classnames"
import EchartOpex from "../../shared/EchartOpex"

const LostcookCumulative = ({ selectedDate, frequency }) => {
  const [fiberlinesLossWithADT, setFiberlineLossWithADT] = useState([])
  const [chartData, setChartData] = useState(null)
  const [includePlanned, setIncludePlanned] = useState(false)
  const buildDailyKpiChart = useCallback((data, type) => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    buildChart(option, data.data, data.date, type)
    return option
  }, [])

  const buildChart = (option, data, date, type) => {
    if (data && date) {
      option.xAxis.data = date
      option.xAxis.boundaryGap = false
      Object.keys(data).forEach((dataName, index) => {
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: type,
          stack: null,
          areaStyle: null,
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[dataName]
          }
        }
      })
    }
  }

  const fetchData = useCallback(
    source => {
      LostcookService.getLostcookCumulativeChart(
        {
          displayAsDate: selectedDate,
          frequency,
          includePlanned: includePlanned
        },
        source
      ).then(
        data => {
          setChartData(buildDailyKpiChart(data, "line"))
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
    [selectedDate, frequency, buildDailyKpiChart, includePlanned]
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
    LostcookService.getFiberlineLossWithADT(
      { displayAsDate: selectedDate, frequency, includePlanned },
      source
    ).then(
      data => {
        setFiberlineLossWithADT(data)
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
  }, [selectedDate, frequency, includePlanned])

  return (
    <>
      <BasicCardContainer bg="dark">
        <div>
          <span className="text-heading text-bold">Include planned shut </span>
          <Toggle
            size="sm"
            checked={includePlanned}
            onChange={() => setIncludePlanned(!includePlanned)}
          />
        </div>
        <Row className=" mt-3">
          <Col xl="3" md="5">
            <div className="d-flex align-items-center justify-content-between __cumulative-adt ">
              <div className="__cards">
                <div>
                  <div className="__atd-boxs">
                    {fiberlinesLossWithADT &&
                      fiberlinesLossWithADT.map((item, index) => {
                        if (item.displayAdt) {
                          return (
                            <span key={index}>
                              1 cook from {item.fiberlineName} = {item.adt} Adt
                            </span>
                          )
                        }
                      })}
                  </div>
                  <div className="numbers_chart">
                    <div className="__numbers_left">
                      <div className={classnames("__numbers", "__table")}>
                        {fiberlinesLossWithADT &&
                          fiberlinesLossWithADT.map((item, index) => {
                            return (
                              <div
                                className="__number"
                                key={`__number-${index}`}
                              >
                                <h2>{item.fiberlineName}</h2>
                                <h1 className="text-default">
                                  {Number.parseFloat(item.value).toFixed(0)}
                                </h1>
                                <h3>{item.desc}</h3>
                              </div>
                            )
                          })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          <Col xl="9" md="7">
            <EchartOpex
              chartTitle={`Lostcook Cumulative for Each fiberline 
                  ${
                    includePlanned ? "with" : "without"
                  } Planned Shutdown (Adt)`}
              style={{ maxHeight: "280px", width: "100%" }}
              option={chartData || {}}
              chartHeader={
                <div className="process-line-chart__header">
                  <div className="d-flex align-items-center">
                    <h2 className="text-heading">
                      Lostcook Cumulative for Each fiberline{" "}
                      {includePlanned ? "with" : "without"} Planned Shutdown
                      (Adt)
                    </h2>
                  </div>
                </div>
              }
            />
          </Col>
        </Row>
      </BasicCardContainer>
    </>
  )
}

export default LostcookCumulative
