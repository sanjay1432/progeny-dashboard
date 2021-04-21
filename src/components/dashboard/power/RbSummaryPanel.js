import React, { useEffect, useCallback, useState } from "react"
import DashboardService from "../../../services/dashboard.service"
import { useSelector } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"
import { CANCEL_REQUEST } from "../../../constants"
import { Alert } from "rsuite"
import { Row, Col, Container } from "reactstrap"
import axios from "axios"
import HeaderTabPanel from "../../shared/HeaderTabPanel"
import OpexKpiTable from "../../shared/OpexKpiTable"
import _ from "lodash"

const RbSummaryPanel = () => {
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const [tableData, setTableData] = useState([])
  const [tableColumnGroup, setTableColumnGroup] = useState([])
  const tableH =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) - 254

  const fetchData = useCallback(
    source => {
      if (mill && displayAsDate) {
        DashboardService.getRbSummary(
          {
            buId: mill.buId,
            millId: mill.millId,
            displayAsDate
          },
          source
        ).then(
          data => {
            setTableData(data)
            const columns = _.uniqBy(data, "processLineName").map(item => {
              return {
                id: item.processLineName,
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
      {
        <div className="opex-panel-content">
          <HeaderTabPanel filterBy="NOTHING" />
          <div>
            <Scrollbars
              className="__content-tab"
              style={{ height: `calc(100vh - 210px)` }}
            >
              <Container fluid>
                <Row className="__row">
                  <Col>
                    <OpexKpiTable
                      tableName="Summary KPI"
                      tableData={tableData}
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
        </div>
      }
    </>
  )
}

export default RbSummaryPanel
