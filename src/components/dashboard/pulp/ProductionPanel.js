import React, { useEffect, useState, useCallback } from "react"
import BasicCardContainer from "components/shared/BasicCardContainer"
import GeneralService from "../../../services/general.service"
import ProcessLine from "./production/ProcessLine"
import DailyKPIChart from "./production/DailyKPIChart"
import ProductionSelectedProcessChartTable from "./production/ProductionSelectedProcessChartTable"
import { useSelector } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"
import { CANCEL_REQUEST, MILL_INFO } from "../../../constants"
import { Alert } from "rsuite"
import { Row, Col, Container } from "reactstrap"
import axios from "axios"
import ProductionTotalGaugeAndLineChart from "./production/ProductionTotalGaugeAndLineChart"
import _ from "lodash"
import HeaderTabPanel from "../../shared/HeaderTabPanel"

const ProductionPanel = ({ kpiCategoryId }) => {
  const mill = useSelector(state => state.appReducer.mill)
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const [kpis, setKpis] = useState(null)
  const [totalGaugeAndLineChart, setTotalGaugeAndLinechart] = useState(null)

  const fetchData = useCallback(
    async source => {
      await GeneralService.getKpis(
        {
          buId: mill.buId,
          millId: mill.millId,
          kpiCategoryIds: [kpiCategoryId]
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
      const selectedMill = _.find(MILL_INFO, item => {
        return item.buId === mill.buId && item.millId === mill.millId
      })
      if (selectedMill) {
        setTotalGaugeAndLinechart(selectedMill.productions || [])
      }
    },
    [mill.buId, mill.millId, kpiCategoryId]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  return (
    <>
      {kpis && kpiCategoryId && (
        <div className="opex-panel-content">
          <HeaderTabPanel />
          <div>
            <Scrollbars
              className="__content-tab"
              style={{ height: `calc(100vh - 226px)` }}
            >
              <Container fluid>
                {totalGaugeAndLineChart &&
                  totalGaugeAndLineChart.map((type, index) => {
                    return (
                      <Row className="__row" key={index}>
                        <ProductionTotalGaugeAndLineChart
                          kpiCategoryId={kpiCategoryId}
                          kpiId={1}
                          type={type}
                        />
                      </Row>
                    )
                  })}
                <Row className="__row">
                  <Col>
                    <DailyKPIChart kpiCategoryId={kpiCategoryId} />
                  </Col>
                </Row>
                <Row className="__row">
                  <Col>
                    <ProcessLine kpiCategoryId={kpiCategoryId} kpiId={1} />
                  </Col>
                </Row>
                <Row className="__row">
                  <Col>
                    <BasicCardContainer bg="dark">
                      <ProductionSelectedProcessChartTable
                        kpiCategoryId={kpiCategoryId}
                        kpiId={1}
                        processLines={processLines}
                      />
                    </BasicCardContainer>
                  </Col>
                </Row>
              </Container>
            </Scrollbars>
          </div>
        </div>
      )}
    </>
  )
}

export default ProductionPanel
