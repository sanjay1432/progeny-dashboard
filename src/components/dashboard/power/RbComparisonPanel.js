import React, { useEffect, useCallback, useState, useMemo } from "react"
import DashboardService from "../../../services/dashboard.service"
import { useSelector } from "react-redux"
import { Scrollbars } from "react-custom-scrollbars"
import { CANCEL_REQUEST, FILE_TYPE, MILL_LIST } from "../../../constants"
import { Alert, Dropdown, Icon, IconButton, Table } from "rsuite"
import { Row, Col, Container } from "reactstrap"
import axios from "axios"
import HeaderTabPanel from "../../shared/HeaderTabPanel"
import _ from "lodash"
import { ExportDropdownItem } from "../../shared/ExportDropdownItem"
const { Column, HeaderCell, Cell } = Table
const tableName = "COMPARISON KEY PERFORMANCE INDICATOR"
const firstColGroups = [
  {
    label: "YESTERDAY AVERAGE",
    dataKey: "todayValue"
  },
  {
    label: "30 DAYS AVERAGE",
    dataKey: "avg30DaysValue"
  }
]
const COL_WIDTH = 80
const COL_X_PADDING = 20
const RbComparisonPanel = () => {
  const mill = useSelector(state => state.appReducer.mill)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const [tableData, setTableData] = useState([])
  const [millColGroups, setMillColGroups] = useState([])
  const [processLineColGroups, setProcessLineColGroups] = useState([])
  const [xlsData, setXlsData] = useState([])
  const [csvData, setCsvData] = useState("")
  const tableH =
    Math.max(
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    ) - 254

  const fetchData = useCallback(
    source => {
      if (mill && displayAsDate) {
        DashboardService.getRbComparison(
          {
            buId: mill.buId,
            millIds: [1, 3], //hard code
            displayAsDate
          },
          source
        ).then(
          data => {
            setTableData(data)
            let secondColumnRow = []
            let thirdColumnRow = []
            data.forEach(millData => {
              const millCol = _.uniqBy(millData, "millId").map(item => {
                return {
                  millId: item.millId,
                  millName: _.find(MILL_LIST, ["millId", item.millId]).name
                }
              })
              const processCol = _.uniqBy(millData, "processLineName").map(
                item => {
                  return {
                    millId: item.millId,
                    processLineName: item.processLineName
                  }
                }
              )
              secondColumnRow = [...secondColumnRow, ...millCol]
              thirdColumnRow = [...thirdColumnRow, ...processCol]
            })
            setMillColGroups(secondColumnRow)
            setProcessLineColGroups(thirdColumnRow)
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

  const getTableData = useCallback(() => {
    return _.uniqBy([].concat(...tableData), "kpiId")
  }, [tableData])

  const exportFile = useMemo(() => {
    let rowDataArr = []
    let csvDataObj = "KPI, Unit,"

    firstColGroups.forEach(firstCol => {
      millColGroups.forEach(millCol => {
        let col = `${firstCol.label} ${millCol.millName} `
        processLineColGroups
          .filter(item => item.millId === millCol.millId)
          .forEach(processCol => {
            csvDataObj += `${col} ${processCol.processLineName},`
          })
      })
    })
    csvDataObj += `\r\n`
    getTableData().forEach(kpiRow => {
      let rowData = {}
      firstColGroups.forEach((firstCol, firstColIndex) => {
        tableData.forEach((millData, millIndex) => {
          processLineColGroups
            .filter(p => millData[0] && p.millId === millData[0].millId)
            .forEach((processLineCol, index) => {
              const objectData = _.keyBy(
                millData.filter(
                  kpiData =>
                    kpiData.kpiId === kpiRow.kpiId &&
                    processLineCol.millId === kpiData.millId
                ),
                "processLineName"
              )
              const row = objectData[processLineCol.processLineName]
              if (row) {
                const data = row[firstCol.dataKey]
                const rowName = `${firstCol.label} ${
                  _.find(MILL_LIST, ["millId", millData[0].millId]).name
                }`

                if (millIndex === 0 && firstColIndex === 0 && index === 0) {
                  csvDataObj += `${row.kpiName}, ${row.kpiUnit}, ${data},`
                  rowData[`KPI`] = row.kpiName
                  rowData[`Unit`] = row.kpiUnit
                  rowData[`${rowName} ${processLineCol.processLineName}`] = data
                } else {
                  csvDataObj += `${data},`
                  rowData[`${rowName} ${processLineCol.processLineName}`] = data
                }
              }
            })
        })
      })
      csvDataObj += `\r\n`
      rowDataArr.push(rowData)
    })
    setCsvData(csvDataObj)
    setXlsData(rowDataArr)
  }, [getTableData, millColGroups, processLineColGroups, tableData])

  const KpiCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props}>
        <div className="column-group-child">
          {tableData.map((millData, index) => {
            return processLineColGroups
              .filter(p => millData[0] && p.millId === millData[0].millId)
              .map((processLineCol, processLineColIndex) => {
                const objectData = _.keyBy(
                  millData.filter(
                    kpiData =>
                      kpiData.kpiId === rowData.kpiId &&
                      processLineCol.millId === kpiData.millId
                  ),
                  "processLineName"
                )
                const row = objectData[processLineCol.processLineName]
                if (row) {
                  return (
                    <span key={`${index}-${processLineColIndex}`}>
                      {row[dataKey]}
                    </span>
                  )
                } else {
                  return "-"
                }
              })
          })}
        </div>
      </Cell>
    )
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
                <Row className="__row">
                  <Col>
                    <div className="__header mb-2">
                      <div className="d-flex justify-content-between align-items-center flex-wrap">
                        <p className="info_box mb-0">
                          <strong>{tableName}</strong>
                        </p>
                        <Dropdown
                          placement="bottomEnd"
                          renderTitle={() => {
                            return (
                              <IconButton
                                onClick={() => exportFile}
                                appearance="primary"
                                size="sm"
                                className="mr-2 export-btn"
                                icon={<Icon icon="download" />}
                                placement="left"
                              />
                            )
                          }}
                        >
                          <ExportDropdownItem
                            icon="file-excel-o"
                            data={xlsData}
                            fileName={tableName}
                            fileType={FILE_TYPE.xls}
                            label=".xlsx"
                          />
                          <ExportDropdownItem
                            icon="file-excel-o"
                            data={csvData}
                            fileName={tableName}
                            fileType={FILE_TYPE.csv}
                            label=".csv"
                          />
                        </Dropdown>
                      </div>
                    </div>
                    <Table
                      bordered
                      cellBordered
                      height={tableH}
                      headerHeight={85}
                      data={getTableData()}
                      renderLoading={test => {
                        return (
                          <div style={{ height: 300 }}>
                            Please wait, Table is rendering...
                          </div>
                        )
                      }}
                      className="summary-table"
                    >
                      <Column width={180} fixed>
                        <HeaderCell>KPI</HeaderCell>
                        <Cell dataKey="kpiName" />
                      </Column>
                      <Column width={80} fixed>
                        <HeaderCell>Unit</HeaderCell>
                        <Cell dataKey="kpiUnit" />
                      </Column>
                      {firstColGroups.map((firstCol, firstColIndex) => {
                        return (
                          <Column
                            key={`${firstColIndex}-${Date.now()}`}
                            width={
                              processLineColGroups.length * COL_WIDTH +
                              COL_X_PADDING
                            }
                            className="highlight clear-padding"
                          >
                            <HeaderCell>
                              <div className="column-group col-border">
                                {firstCol.label}
                              </div>
                              <div className="column-group-child space-around col-border">
                                {millColGroups &&
                                  millColGroups.map((millCol, millColIndex) => {
                                    const numOfSecondCol = processLineColGroups.filter(
                                      item => item.millId === millCol.millId
                                    ).length
                                    return (
                                      <span
                                        key={`${millColIndex}-${millCol.millId}-${firstColIndex}`}
                                        style={{
                                          width: numOfSecondCol * COL_WIDTH
                                        }}
                                      >
                                        {millCol.millName}
                                      </span>
                                    )
                                  })}
                              </div>
                              <div className="column-group-child padding">
                                {millColGroups &&
                                  millColGroups.map((millCol, millColIndex) => {
                                    return processLineColGroups
                                      .filter(
                                        item => item.millId === millCol.millId
                                      )
                                      .map(processCol => {
                                        return (
                                          <span
                                            key={`${millColIndex}-${millCol.millId}-${firstColIndex}-${processCol.processLineName}`}
                                          >
                                            {processCol.processLineName}
                                          </span>
                                        )
                                      })
                                  })}
                              </div>
                            </HeaderCell>
                            <KpiCell dataKey={firstCol.dataKey} />
                          </Column>
                        )
                      })}
                    </Table>
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

export default RbComparisonPanel
