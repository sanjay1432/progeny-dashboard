import React, { useEffect, useState, useCallback } from "react"
import ProductionHelper from "../../../helper/production.helper"
import { useSelector } from "react-redux"
import moment from "moment"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants"
import Filter from "./consumption/Filter"
import NumberCardsAndChart from "components/shared/NumberCardsAndChart"
import { Scrollbars } from "react-custom-scrollbars"
import { Container } from "reactstrap"
import GeneralHelper from "../../../helper/general.helper"

const ConsumptionPanel = ({ kpiCategoryId }) => {
  const mill = useSelector(state => state.appReducer.mill)
  const latestDate = useSelector(state => state.dashboardReducer.latestDate)
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const [kpis, setKpis] = useState(null)
  const [selectedKPIs, setSelectedKPIs] = useState([])
  const [filterParams, setFilterParams] = useState({})
  const fetchData = useCallback(
    source => {
      GeneralHelper.getKpiList(mill, kpiCategoryId, source, setKpis)
    },
    [mill, kpiCategoryId]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const onFilter = (selectedKPIArr, params) => {
    setSelectedKPIs(selectedKPIArr)
    setFilterParams(params)
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <div className="product_square_boxes">
              {processLines &&
                processLines.map((item, index) => {
                  return ProductionHelper.buildProcessLine(item, index)
                })}
            </div>
            <p className="info_box mb-0">
              <i className="fa fa-exclamation-circle" /> Latest date available:{" "}
              <strong>{moment(latestDate).format("DD MMM YYYY")}.</strong> Next
              update: <strong>Tomorrow at 8:30AM</strong>
            </p>
          </div>
          <Filter
            kpisCategories={kpis}
            processLines={processLines}
            onFilter={onFilter}
          />
        </div>
        <Scrollbars
          className="__content-tab"
          style={{ height: `calc(100vh - 350px)` }}
        >
          <Container fluid>
            {filterParams &&
              selectedKPIs.map((kpiId, index) => {
                return (
                  <div
                    className="__row"
                    key={`consumption-kpi${kpiId}-${index}`}
                  >
                    <NumberCardsAndChart
                      filterParams={{
                        buId: mill.buId,
                        millId: mill.millId,
                        displayAsDate,
                        kpiCategoryId,
                        kpiId,
                        countryId: mill.countryId,
                        processLines: [...filterParams.selectedProcessLines],
                        frequency: filterParams.frequency,
                        dateRange: filterParams.dateRange
                      }}
                    />
                  </div>
                )
              })}
          </Container>
        </Scrollbars>
      </div>
    </>
  )
}

export default ConsumptionPanel
