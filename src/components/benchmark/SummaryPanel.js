import React, { useEffect, useState, useCallback } from "react"
import PerfectScrollbar from "react-perfect-scrollbar"
import $ from "jquery"
import { useSelector } from "react-redux"
import moment from "moment"
import { Table } from "rsuite"
import axios from "axios"
import { CANCEL_REQUEST } from "../../constants"
import SummaryDetailPanel from "./summary/SummaryDetailPanel"
const { Column, HeaderCell, Cell } = Table

const SummaryPanel = ({ kpiData }) => {
  const displayPeriods = useSelector(
    state => state.dashboardReducer.displayPeriods
  )
  const displayProcessLine = useSelector(
    state => state.dashboardReducer.displayProcessLine
  )
  const [tableData, setTableData] = useState([])
  const [selectedKpi, setSelectedKpi] = useState(null)

  const fetchData = useCallback(
    source => {
      setTableData(kpiData)
    },
    [kpiData]
  )

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

  if (tableData && tableData[0] && tableData[0].summaryDataSet) {
    return (
      <>
        <div className="opex-panel-content">
          <div className="__header">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <p className="info_box mb-0">
                <strong>
                  KPI Performance Summary for{" "}
                  {displayProcessLine
                    ? displayProcessLine.processLineCode
                    : "N/A"}
                </strong>
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
                    // height={420}
                    // headerHeight={80}
                    data={tableData}
                    onRowClick={data => {
                      console.log(data)
                    }}
                  >
                    <Column width={70} align="center">
                      <HeaderCell>No.</HeaderCell>
                      <Cell>
                        {rowData => {
                          return <span>{rowData.kpi.id}</span>
                        }}
                      </Cell>
                    </Column>

                    <Column width={200} align="center">
                      <HeaderCell>KPI</HeaderCell>
                      <Cell>
                        {rowData => {
                          function handleAction() {
                            setSelectedKpi(rowData.kpi)
                            //setSelectedSummary(rowData.summaryDataSet);
                            console.log(rowData)
                            //alert(`id:${rowData.kpi.kpiName}`);
                          }
                          return (
                            <span>
                              <a className="pointer" onClick={handleAction}>
                                {" "}
                                {rowData.kpi.kpiName}{" "}
                              </a>
                            </span>
                          )
                        }}
                      </Cell>
                    </Column>

                    <Column width={200} flexGrow={1}>
                      <HeaderCell>
                        {moment(
                          tableData[0].summaryDataSet[0].dateRange.startDate
                        ).format("DD MMM YYYY")}{" "}
                        to{" "}
                        {moment(
                          tableData[0].summaryDataSet[0].dateRange.endDate
                        ).format("DD MMM YYYY")}
                      </HeaderCell>
                      <Cell>
                        {rowData => {
                          return <span>{rowData.summaryDataSet[0].avg}</span>
                        }}
                      </Cell>
                    </Column>

                    <Column width={200} flexGrow={1}>
                      <HeaderCell>
                        {moment(
                          tableData[0].summaryDataSet[1].dateRange.startDate
                        ).format("DD MMM YYYY")}{" "}
                        to{" "}
                        {moment(
                          tableData[0].summaryDataSet[1].dateRange.endDate
                        ).format("DD MMM YYYY")}
                      </HeaderCell>
                      <Cell>
                        {rowData => {
                          return <span>{rowData.summaryDataSet[1].avg}</span>
                        }}
                      </Cell>
                    </Column>

                    {displayPeriods.length > 2 &&
                    tableData[0].summaryDataSet[2] &&
                    tableData[0].summaryDataSet[2].dateRange ? (
                      <Column width={200} flexGrow={1}>
                        <HeaderCell>
                          {moment(
                            tableData[0].summaryDataSet[2].dateRange.startDate
                          ).format("DD MMM YYYY")}{" "}
                          to{" "}
                          {moment(
                            tableData[0].summaryDataSet[2].dateRange.endDate
                          ).format("DD MMM YYYY")}
                        </HeaderCell>
                        <Cell>
                          {rowData => {
                            return <span>{rowData.summaryDataSet[2].avg}</span>
                          }}
                        </Cell>
                      </Column>
                    ) : (
                      ""
                    )}

                    {displayPeriods.length > 3 &&
                    tableData[0].summaryDataSet[3] &&
                    tableData[0].summaryDataSet[3].dateRange ? (
                      <Column width={200} flexGrow={1}>
                        <HeaderCell>
                          {moment(
                            tableData[0].summaryDataSet[3].dateRange.startDate
                          ).format("DD MMM YYYY")}{" "}
                          to{" "}
                          {moment(
                            tableData[0].summaryDataSet[3].dateRange.endDate
                          ).format("DD MMM YYYY")}
                        </HeaderCell>
                        <Cell>
                          {rowData => {
                            return <span>{rowData.summaryDataSet[3].avg}</span>
                          }}
                        </Cell>
                      </Column>
                    ) : (
                      ""
                    )}

                    <Column width={140}>
                      <HeaderCell>Delta</HeaderCell>
                      <Cell>
                        {rowData => {
                          return <span>{rowData.kpi.delta}</span>
                        }}
                      </Cell>
                    </Column>
                  </Table>
                </div>
              </div>
            </PerfectScrollbar>
          </div>
        </div>

        <SummaryDetailPanel Kpi={selectedKpi} Periods={displayPeriods} />
      </>
    )
  } else {
    return null
  }
}

export default SummaryPanel
