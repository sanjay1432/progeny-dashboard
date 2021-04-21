import React, { useEffect, useState } from "react"
import { Row, Col, Container } from "reactstrap"
import FilterLostcook from "./FilterLostcook"
import LCAnalysisBarChart from "./lostcook-analysis/LCAnalysisBarChart"
import LCAnalysisPieChart from "./lostcook-analysis/LCAnalysisPieChart"
import LCAnalysisTable from "./lostcook-analysis/LCAnalysisTable"
import LCAnalysisParetoChart from "./lostcook-analysis/LCAnalysisParetoChart"
import { Scrollbars } from "react-custom-scrollbars"
import { Loader } from "rsuite"

const LostcookAnalysisPanel = ({ latestDate }) => {
  const [filterParams, setFilterParams] = useState(null)
  const [panelHeight, setPanelHeight] = useState(200)
  const onFilter = params => {
    setFilterParams(params)
  }
  useEffect(() => {
    const height =
      Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      ) -
      Math.max(
        document.getElementById("lc-filter").clientHeight || 0,
        document.getElementById("lc-filter").innerHeight || 0
      ) -
      190
    setPanelHeight(height)
  }, [filterParams])

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <FilterLostcook
            onFilter={onFilter}
            latestDate={latestDate}
            showSearchText={false}
          />
        </div>
        <Scrollbars className="__content-tab" style={{ height: panelHeight }}>
          {filterParams ? (
            <Container fluid>
              <Row className="__row">
                <Col sm="12" md="6">
                  <LCAnalysisBarChart params={filterParams} />
                </Col>
                <Col sm="12" md="6">
                  <LCAnalysisPieChart params={filterParams} />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="12">
                  <LCAnalysisTable params={filterParams} />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="problems"
                    name="Loss"
                    subTitle="Adt"
                  />
                </Col>
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="equipment"
                    name="Loss"
                    subTitle="Adt"
                  />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="frequency-problems"
                    name="Frequency"
                  />
                </Col>
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="frequency-equipment"
                    name="Frequency"
                  />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="area"
                    name="Area"
                  />
                </Col>
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="frequency-area"
                    name="Frequency Area"
                  />
                </Col>
              </Row>

              <Row className="__row">
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="responsibility"
                    name="Responsibility"
                  />
                </Col>
                <Col md="6">
                  <LCAnalysisParetoChart
                    params={filterParams}
                    chartType="frequency-responsibility"
                    name="Frequency Responsibility"
                  />
                </Col>
              </Row>
            </Container>
          ) : (
            <Loader center content="Loading" />
          )}
        </Scrollbars>
      </div>
    </>
  )
}

export default LostcookAnalysisPanel
