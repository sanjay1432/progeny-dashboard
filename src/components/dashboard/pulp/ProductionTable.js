import React, { useCallback, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import moment from "moment"
import { CANCEL_REQUEST, KPI_CATEGORIES } from "../../../constants"
import DashboardService from "../../../services/dashboard.service"
import _ from "lodash"
import { Alert } from "rsuite"
import axios from "axios"
import { Col, Container, Row } from "reactstrap"
import OpexKpiTable from "../../shared/OpexKpiTable"
import { Scrollbars } from "react-custom-scrollbars"

const ProductionTableContent = ({ tableName, totalTblProdKpiFlag }) => {
  const [tableDataSet, setTableDataSet] = useState(null)
  const [tableColumnGroup, setTableColumnGroup] = useState([])
  const [tableH, setTableH] = useState(200)
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const contentHeight =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) - 254
  const fetchData = useCallback(
    source => {
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        displayAsDate,
        kpiCategoryId: KPI_CATEGORIES.production.kpiCategoryId,
        totalTblProdKpiFlag: totalTblProdKpiFlag
      }
      DashboardService.getSummaryByCategory(param, source).then(
        data => {
          setTableDataSet(data)
          const columns = _.uniqBy(data, "processLineCode").map(item => {
            return {
              id: item.processLineCode,
              processLineCode: item.processLineCode
            }
          })
          setTableColumnGroup(columns)
          let height = 65 + _.uniqBy(data, "kpiId").length * 46
          if (height > contentHeight) {
            height = contentHeight
          }
          setTableH(height)
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
    [mill, displayAsDate, contentHeight, totalTblProdKpiFlag]
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
    <OpexKpiTable
      tableName={tableName}
      tableData={tableDataSet}
      columnGroupBy="processLineCode"
      tableColumnGroup={tableColumnGroup}
      uniqBy="kpiId"
      tableHeight={tableH}
    />
  )
}

const ProductionTable = () => {
  const latestDate = useSelector(state => state.dashboardReducer.latestDate)
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
                <ProductionTableContent
                  tableName="1. Total Production"
                  totalTblProdKpiFlag={true}
                />
              </Col>
            </Row>
            <Row className="__row">
              <Col>
                <ProductionTableContent
                  tableName="2. Daily Production by Fiberline"
                  totalTblProdKpiFlag={false}
                />
              </Col>
            </Row>
          </Container>
        </Scrollbars>
      </div>
    </>
  )
}

export default ProductionTable
