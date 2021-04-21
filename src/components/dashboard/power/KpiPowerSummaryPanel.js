import React, { useEffect, useCallback, useState } from "react"
import DashboardService from "../../../services/dashboard.service"
import { useSelector } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"
import { CANCEL_REQUEST } from "../../../constants"
import { Alert, Loader } from "rsuite"
import { Row, Col, Container } from "reactstrap"
import axios from "axios"
import HeaderTabPanel from "../../shared/HeaderTabPanel"
import OpexKpiTable from "../../shared/OpexKpiTable"
import _ from "lodash"

const KpiPowerSummaryPanel = () => {
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const [tableDataSet, setTableDataSet] = useState(null)
  const contentHeight =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) - 254

  const fetchData = useCallback(
    source => {
      if (mill && displayAsDate) {
        DashboardService.getPowerKpiSummary(
          {
            buId: mill.buId,
            millId: mill.millId,
            displayAsDate
          },
          source
        ).then(
          data => {
            setTableDataSet(_.groupBy(data, "processLineGroupBy"))
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

  const getTableColumnGroup = kpiGroupName => {
    return _.uniqBy(tableDataSet[kpiGroupName], "processLineName").map(item => {
      return {
        id: item.processLineName,
        processLineName: item.processLineName
      }
    })
  }

  const kpiMappingTableName = kpiGroupName => {
    switch (kpiGroupName) {
      case "EV":
        return "Evaps KPI"
      case "LK":
        return "Lime Kiln KPI"
      case "TG1":
      case "TG2":
        return "Turbine Generator KPI"
      default:
        return "Power KPI Table"
    }
  }

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
                {tableDataSet ? (
                  Object.keys(tableDataSet).map((kpiGroup, index) => {
                    let tableH =
                      65 + _.uniqBy(tableDataSet[kpiGroup], "kpiId").length * 46
                    if (tableH > contentHeight) {
                      tableH = contentHeight
                    }
                    return (
                      <Row className="__row" key={index}>
                        <Col>
                          <OpexKpiTable
                            tableName={kpiMappingTableName(kpiGroup)}
                            tableData={tableDataSet[kpiGroup]}
                            columnGroupBy="processLineName"
                            tableColumnGroup={getTableColumnGroup(kpiGroup)}
                            uniqBy="kpiId"
                            tableHeight={tableH}
                          />
                        </Col>
                      </Row>
                    )
                  })
                ) : (
                  <Loader center content="Loading data..." />
                )}
              </Container>
            </Scrollbars>
          </div>
        </div>
      }
    </>
  )
}

export default KpiPowerSummaryPanel
