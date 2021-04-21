import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import moment from "moment"
import { CANCEL_REQUEST } from "../../../constants"
import { Col, Container, Row } from "reactstrap"
import _ from "lodash"
import OpexKpiTable from "../../shared/OpexKpiTable"
import { Alert } from "rsuite"
import { Scrollbars } from "react-custom-scrollbars"
import DashboardService from "../../../services/dashboard.service"
import axios from "axios"
const tableH =
  Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  ) - 254

const SummaryPanel = () => {
  const latestDate = useSelector(state => state.dashboardReducer.latestDate)
  const [tableDataSet, setTableDataSet] = useState(null)
  const [tableColumnGroup, setTableColumnGroup] = useState([])
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )

  const fetchData = useCallback(
    source => {
      if (mill && displayAsDate) {
        const param = {
          buId: mill.buId,
          millId: mill.millId,
          displayAsDate,
          processLines: []
        }
        DashboardService.getSummary(param, source).then(
          data => {
            setTableDataSet(data)
            const columns = _.uniqBy(data, "processLineName").map(item => {
              return {
                id: item.processLineCode,
                processLineName: item.processLineName
              }
            })
            setTableColumnGroup(columns)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
      }
    },
    [mill, displayAsDate]
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
      <div className="opex-panel-content">
        <div className="__header">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <p className="info_box mb-0">
              <i className="fa fa-exclamation-circle" /> Latest date available:{" "}
              <strong>{moment(latestDate).format("DD MMM YYYY")}.</strong> Next
              update: <strong>Tomorrow at 8:30AM</strong>
            </p>
          </div>
        </div>
        <Scrollbars
          className="__content-tab"
          style={{ height: `calc(100vh - 210px)` }}
        >
          <Container fluid>
            <Row className="__row">
              <Col>
                <OpexKpiTable
                  tableName="Key Performance Indicator Summary"
                  tableData={tableDataSet}
                  columnGroupBy="processLineName"
                  tableColumnGroup={tableColumnGroup}
                  uniqBy="kpiId"
                  tableHeight={tableH}
                />
              </Col>
            </Row>
          </Container>
        </Scrollbars>
      </div>
    </>
  )
}

export default SummaryPanel
