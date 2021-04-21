import React, { useRef, useState, useMemo, useCallback } from "react"
import {
  Dropdown,
  Icon,
  IconButton,
  Loader,
  Table,
  Tooltip,
  Whisper
} from "rsuite"
import { FILE_TYPE } from "../../constants"
import { ExportDropdownItem } from "./ExportDropdownItem"
import _ from "lodash"

const { Column, HeaderCell, Cell } = Table
const COL_WIDTH = 80
const defaultKpiColumnMapping = [
  {
    label: "KPI",
    dataKey: "kpiName",
    width: 180,
    fixed: true
  },
  {
    label: "Unit",
    dataKey: "kpiUnit",
    width: 100,
    fixed: true
  },
  {
    label: "Target",
    dataKey: "threshold"
  },
  {
    label: "Today",
    dataKey: "todayValue",
    directionKey: "todayDirection",
    colorKey: "todayColor",
    toolTipContents: [
      {
        label: "Actual:",
        dataKey: "todayValue"
      },
      {
        label: "Target:",
        dataKey: "threshold"
      },
      {
        label: "Diff:",
        dataKey: "todayDiff",
        formatter: dataRow => {
          return `${dataRow["todayDiff"]} (${dataRow["todayPercentageDiff"]}%)`
        }
      },
      {
        label: "MSR:",
        dataKey: "todayMsr"
      }
    ]
  },
  // {
  //   label: "MTD",
  //   dataKey: "avgMtdValue",
  //   directionKey: "avgMtdDirection",
  //   colorKey: "avgMtdColor",
  //   toolTipContents: [
  //     {
  //       label: "Actual:",
  //       dataKey: "avgMtdValue"
  //     },
  //     {
  //       label: "Target:",
  //       dataKey: "threshold"
  //     },
  //     {
  //       label: "Diff:",
  //       dataKey: "avgMtdDiff",
  //       formatter: dataRow => {
  //         return `${dataRow["avgMtdDiff"]} (${dataRow["avgMtdPercentageDiff"]}%)`
  //       }
  //     }
  //   ]
  // },
  {
    label: "30 Days",
    dataKey: "avg30DaysValue",
    directionKey: "avg30DaysDirection",
    colorKey: "avg30DaysColor",
    toolTipContents: [
      {
        label: "Actual:",
        dataKey: "avg30DaysValue"
      },
      {
        label: "Target:",
        dataKey: "threshold"
      },
      {
        label: "Diff:",
        dataKey: "avg30DaysDiff",
        formatter: dataRow => {
          return `${dataRow["avg30DaysDiff"]} (${dataRow["avg30DaysPercentageDiff"]}%)`
        }
      }
    ]
  },
  {
    label: "90 Days",
    dataKey: "avgQtdValue",
    directionKey: "avgQtdDirection",
    colorKey: "avgQtdColor",
    toolTipContents: [
      {
        label: "Actual:",
        dataKey: "avgQtdValue"
      },
      {
        label: "Target:",
        dataKey: "threshold"
      },
      {
        label: "Diff:",
        dataKey: "avgQtdDiff",
        formatter: dataRow => {
          return `${dataRow["avgQtdDiff"]} (${dataRow["avgQtdPercentageDiff"]}%)`
        }
      }
    ]
  },
  {
    label: "365 Days",
    dataKey: "avgYtdValue",
    directionKey: "avgYtdDirection",
    colorKey: "avgYtdColor",
    toolTipContents: [
      {
        label: "Actual:",
        dataKey: "avgYtdValue"
      },
      {
        label: "Target:",
        dataKey: "threshold"
      },
      {
        label: "Diff:",
        dataKey: "avgYtdDiff",
        formatter: dataRow => {
          return `${dataRow["avgYtdDiff"]} (${dataRow["avgYtdPercentageDiff"]}%)`
        }
      }
    ]
  }
]
const OpexKpiTable = ({
  tableName,
  tableData = [],
  tableColumnGroup = [],
  kpiColumnMapping = defaultKpiColumnMapping,
  columnGroupBy = "processLineName",
  uniqBy = "kpiId",
  tableHeight = 300,
  headerHeight = 65
}) => {
  let tableRef = useRef(null)
  const [xlsData, setXlsData] = useState([])
  const [csvData, setCsvData] = useState("")

  const convertArrayToObjectData = useCallback(
    rowData => {
      return _.keyBy(
        tableData.filter(kpiData => kpiData.kpiId === rowData.kpiId),
        columnGroupBy
      )
    },
    [columnGroupBy, tableData]
  )

  const getTableData = useCallback(() => {
    return _.uniqBy(tableData, uniqBy)
  }, [tableData])

  const exportFile = useMemo(() => {
    let rowDataArr = []
    let csvDataObj = ""
    kpiColumnMapping
      .filter(kpi => kpi.fixed)
      .forEach(kpiCol => {
        csvDataObj += `${kpiCol.label},`
      })
    tableColumnGroup.forEach(col => {
      kpiColumnMapping
        .filter(kpi => !kpi.fixed)
        .forEach(kpiCol => {
          csvDataObj += `${col[columnGroupBy]} ${kpiCol.label},`
        })
    })
    csvDataObj += `\r\n`
    getTableData().forEach(row => {
      let rowData = {}
      const rowGroupData = convertArrayToObjectData(row)
      tableColumnGroup.forEach((colGroup, index) => {
        kpiColumnMapping.forEach(item => {
          //Just need to get the fixed column data from first record
          const kpiName = colGroup[columnGroupBy]
          let data = "-" //empty data
          if (rowGroupData[kpiName]) {
            data = rowGroupData[kpiName][item.dataKey]
          }
          if (index === 0) {
            if (item.fixed) {
              rowData[`${kpiName} ${item.label}`] = row[item.dataKey]
              csvDataObj += `${row[item.dataKey]},`
            } else {
              rowData[`${kpiName} ${item.label}`] = data
              csvDataObj += `${data},`
            }
          } else {
            //Filter out the fixed column
            if (!item.fixed) {
              rowData[`${kpiName} ${item.label}`] = data
              csvDataObj += `${data},`
            }
          }
        })
      })
      rowDataArr.push(rowData)
      csvDataObj += `\r\n`
    })
    setXlsData(rowDataArr)
    setCsvData(csvDataObj)
  }, [
    columnGroupBy,
    convertArrayToObjectData,
    getTableData,
    kpiColumnMapping,
    tableColumnGroup
  ])

  const KpiCell = ({ rowData, dataKey, ...props }) => {
    const rowGroupData = convertArrayToObjectData(rowData)
    const row = rowGroupData[dataKey]
    if (row) {
      return (
        <Cell {...props}>
          <div className="column-group-child">
            {kpiColumnMapping
              .filter(kpi => !kpi.fixed)
              .map((kpiCol, index) => {
                if (kpiCol.toolTipContents) {
                  return (
                    <Whisper
                      key={index}
                      preventOverflow
                      placement="autoVertical"
                      speaker={
                        <Tooltip>
                          <ul>
                            {kpiCol.toolTipContents.map((tool, toolIndex) => {
                              return (
                                <li key={toolIndex}>
                                  <span>{tool.label}</span>
                                  <span>
                                    {tool.formatter
                                      ? tool.formatter(row)
                                      : row[tool.dataKey]}
                                  </span>
                                </li>
                              )
                            })}
                          </ul>
                        </Tooltip>
                      }
                    >
                      <span className={`sign-${row[kpiCol.colorKey]}`}>
                        {row[kpiCol.dataKey]}
                        {row[kpiCol.directionKey] && (
                          <i
                            className={`fa fa-caret-${
                              row[kpiCol.directionKey]
                            }`}
                          />
                        )}
                      </span>
                    </Whisper>
                  )
                } else {
                  return (
                    <span
                      key={index}
                      className={`sign-${row[kpiCol.colorKey]}`}
                    >
                      {row[kpiCol.dataKey]}
                      {row[kpiCol.directionKey] && (
                        <i
                          className={`fa fa-caret-${row[kpiCol.directionKey]}`}
                        />
                      )}
                    </span>
                  )
                }
              })}
          </div>
        </Cell>
      )
    } else {
      return <Cell {...props} />
    }
  }

  return (
    <>
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
                  onClick={async () => exportFile}
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

      <div ref={tableRef}>
        <Table
          bordered
          cellBordered
          height={tableHeight > 160 ? tableHeight : 160}
          headerHeight={headerHeight}
          data={getTableData()}
          renderLoading={test => {
            return (
              <div style={{ height: tableHeight }}>
                Please wait, Table is rendering...
              </div>
            )
          }}
          className="summary-table"
          affixHorizontalScrollbar
        >
          {kpiColumnMapping
            .filter(kpi => kpi.fixed)
            .map((kpiCol, kpiColIndex) => (
              <Column key={kpiColIndex} width={kpiCol.width || 80} fixed>
                <HeaderCell>{kpiCol.label}</HeaderCell>
                <Cell dataKey={kpiCol.dataKey} />
              </Column>
            ))}
          {tableColumnGroup.map((item, index) => {
            return (
              <Column
                key={index}
                width={
                  COL_WIDTH * kpiColumnMapping.filter(kpi => !kpi.fixed).length
                }
                className="highlight"
              >
                <HeaderCell>
                  <div className="column-group">{item[columnGroupBy]}</div>
                  <div className="column-group-child">
                    {kpiColumnMapping
                      .filter(kpi => !kpi.fixed)
                      .map((kpiCol, kpiColIndex) => (
                        <span key={kpiColIndex}>{kpiCol.label}</span>
                      ))}
                  </div>
                </HeaderCell>
                <KpiCell dataKey={item[columnGroupBy]} />
              </Column>
            )
          })}
        </Table>
      </div>
    </>
  )
}

export default OpexKpiTable
