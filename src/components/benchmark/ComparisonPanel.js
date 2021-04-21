import React, { useEffect, useState, useCallback } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import $ from "jquery"
import CIService from "../../services/ci.service"
import ImprovementModal from "./improvement/ImprovementModal"
import { useSelector } from "react-redux"
import moment from "moment"
import { Table, Alert, Icon, IconButton } from "rsuite"
import axios from "axios"
import { CANCEL_REQUEST } from "../../constants"

// reactstrap components
import { Button } from "reactstrap"

const { Column, HeaderCell, Cell } = Table

const ImprovementPanel = kpiCategoryId => {
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const [showDetail, setShowDetail] = useState(false)
  const [selectedData, setSelectedData] = useState(null)
  const [tableData, setTableData] = useState([])

  const fetchData = useCallback(source => {
    const param = {
      buId: mill.buId,
      millId: mill.millId,
      displayAsDate,
      kpiCategoryId
    }
    CIService.getProject(param, source).then(
      data => {
        setTableData(data)
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error("We got an unknown error.", 5000)
        }
        console.log(error)
        return Promise.reject()
      }
    )
  }, [])

  useEffect(() => {
    const navbarH = $("#navbar-main").outerHeight()
    const mainTabItemH = $(".main-tabs-item").outerHeight()
    const mainTabContentH = $(
      ".main-tabs-content .tab-content .tab-pane.active .__header"
    ).outerHeight()
    $(".__content .scrollable").outerHeight(
      window.innerHeight - navbarH - mainTabItemH - mainTabContentH - 140
    )
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const toggleDetail = show => {
    setShowDetail(show)
  }

  const editItem = object => {
    setSelectedData(object)
    setShowDetail(true)
  }

  return (
    <>
      <div className="opex-panel-content">
        <div className="__header">
          <div className="justify-content-between align-items-center flex-wrap">
            <p className="info_box mb-0">
              <strong>KPI Performance Summary for FL2</strong>
              <div className="right-control pull-right">
                <Button
                  size="sm"
                  color="primary"
                  className="btn-rounded pd-big"
                  style={{ marginTop: "-9px" }}
                  onClick={() => editItem(null)}
                >
                  Add Project
                </Button>
              </div>
            </p>
          </div>
        </div>
        <div className="__content mt-3">
          <PerfectScrollbar>
            <div className="scrollable">
              <div>
                <Table
                  bordered
                  cellBordered
                  height={420}
                  //headerHeight={80}
                  data={tableData}
                  onRowClick={data => {
                    console.log(data)
                  }}
                >
                  <Column width={70} fixed="left" align="center">
                    <HeaderCell>No.</HeaderCell>
                    <Cell dataKey="id" />
                  </Column>

                  <Column width={220} fixed="left">
                    <HeaderCell>Date</HeaderCell>
                    <Cell>
                      {rowData => {
                        return (
                          <span>
                            {moment(rowData.dateRange.startDate).format(
                              "DD MMM YYYY"
                            )}{" "}
                            to{" "}
                            {moment(rowData.dateRange.endDate).format(
                              "DD MMM YYYY"
                            )}
                          </span>
                        )
                      }}
                    </Cell>
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Project Type</HeaderCell>
                    <Cell dataKey="projectTypeName" />
                  </Column>

                  <Column width={250} flexGrow={1}>
                    <HeaderCell>Project Initiative</HeaderCell>
                    <Cell dataKey="projectInitiative" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Project Leader</HeaderCell>
                    <Cell dataKey="projectLeader" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Project Co-Leader</HeaderCell>
                    <Cell dataKey="projectCoLeader" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>KPI</HeaderCell>
                    <Cell dataKey="kpiName" />
                  </Column>

                  <Column width={150}>
                    <HeaderCell>Process Line</HeaderCell>
                    <Cell dataKey="processLine" />
                  </Column>

                  <Column width={90} fixed="right" resizable>
                    <HeaderCell>Action</HeaderCell>
                    <Cell className="__action_col">
                      {rowData => {
                        return (
                          <div className="d-flex justify-content-space-center align-items-center">
                            <IconButton
                              size="sm"
                              icon={<Icon icon="pencil" />}
                              onClick={() => editItem(rowData)}
                            />
                          </div>
                        )
                      }}
                    </Cell>
                  </Column>
                </Table>

                <ImprovementModal
                  show={showDetail}
                  selectedData={selectedData}
                  onToggle={toggleDetail}
                />
              </div>
            </div>
          </PerfectScrollbar>
        </div>
      </div>
    </>
  )
}

export default ImprovementPanel
