import React, { useEffect, useState, useCallback, useRef } from "react"
import DashboardService from "../../../../services/dashboard.service"
import GeneralService from "../../../../services/general.service"
import _ from "lodash"
import axios from "axios"
import {
  PRODUCT_COLORS,
  CANCEL_REQUEST,
  FILE_TYPE,
  FILTER_DATE_RANGES
} from "../../../../constants"
import {
  DateRangePicker,
  Alert,
  InputPicker,
  Tooltip,
  Whisper,
  IconButton,
  Icon,
  Dropdown
} from "rsuite"
import moment from "moment"
import { useSelector } from "react-redux"
import OpexBasicTable from "../../../shared/OpexBasicTable"
import { LINE_CHART_OPTION, FREQUENCY_SELECT_OPTS } from "../../../../constants"
import ChartWithAnnotation from "../../../shared/ChartWithAnnotation"
import { ExportDropdownItem } from "../../../shared/ExportDropdownItem"

const ProductionSelectedProcessChartTable = ({
  kpiCategoryId,
  kpiId,
  processLines
}) => {
  const [selectedPrecessChart, setSelectedPrecessChart] = useState(null)
  const [tableData, setTableData] = useState(null)
  const [frequency, setFrequency] = useState(FREQUENCY_SELECT_OPTS[0].value)
  const latestDate = useSelector(state => state.dashboardReducer.latestDate)
  const [dateRange, setDateRange] = useState([
    new Date(
      moment(new Date(latestDate)).add(-10, "days").format("YYYY-MM-DD")
    ),
    new Date(latestDate)
  ])
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const mill = useSelector(state => state.appReducer.mill)
  const [annotations, setAnnotations] = useState(null)
  const [xlsData, setXlsData] = useState([])
  const [csvData, setCsvData] = useState("")
  const [pdfData, setPdfData] = useState("")
  let tableRef = useRef(null)

  const buildDailyKpiChart = useCallback(data => {
    const option = _.cloneDeep(LINE_CHART_OPTION)
    buildChart(option, data.data, data.dates)
    return option
  }, [])

  const fetchData = useCallback(
    async source => {
      const param = {
        buId: mill.buId,
        millId: mill.millId,
        kpiCategoryId,
        frequency: frequency,
        dateRange,
        kpiId
      }
      if (processLines) {
        GeneralService.annotationDates(
          {
            ...param,
            processLines: processLines.map(item => item.processLineCode)
          },
          source
        ).then(
          data => {
            setAnnotations(data.annotationDates)
            DashboardService.selectedProcessLines(
              { type: "chart", ...param },
              source
            ).then(
              data1 => {
                setSelectedPrecessChart(buildDailyKpiChart(data1))
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
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
      }

      DashboardService.selectedProcessLines(
        { type: "table", ...param },
        source
      ).then(
        data => {
          setTableData(buildColumnFormat(data))
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
    [
      kpiId,
      buildDailyKpiChart,
      frequency,
      dateRange,
      mill,
      kpiCategoryId,
      processLines
    ]
  )

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData])

  const buildColumnFormat = data => {
    if (data && data.columns) {
      data.columns.map(column => {
        if (column.id !== "date") {
          column.format = value => {
            console.log(value)
            const diff = value.value - value.target
            const diffPercent = ((diff * 100) / value.value).toFixed(2)
            let clazz = ""
            let icon = ""
            if (value.value < value.target) {
              clazz = "sign-down"
              icon = <i className="fa fa-caret-down" />
            } else {
              clazz = "sign-up"
              icon = <i className="fa fa-caret-up" />
            }
            return (
              //preventOverflow container={tableRef.current}
              <Whisper
                placement="bottom"
                speaker={
                  <Tooltip>
                    <ul>
                      <li>
                        <span>Budget:</span>
                        <span>{value.target}</span>
                      </li>
                      <li>
                        <span>Diff</span>
                        <span>
                          {diff > 0 ? `+${diff}` : `${diff}`}
                          {` (${diffPercent}%)`}
                        </span>
                      </li>
                    </ul>
                  </Tooltip>
                }
              >
                <span className={`${clazz}`}>
                  {value.value} {icon}
                </span>
              </Whisper>
            )
          }
        }
        return column
      })
    }
    return { columns: data.columns, rows: data.rows }
  }

  const buildChart = (option, data, dates) => {
    if (data && dates) {
      option.xAxis.data = dates
      option.xAxis.boundaryGap = false
      const keyData = Object.keys(data)
      let selectedObj = {}
      keyData.forEach(item => {
        selectedObj[item] = !item.toUpperCase().startsWith("PD")
      })
      option.legend.selected = selectedObj

      keyData.forEach((dataName, index) => {
        option.series[index] = {
          data: data[dataName],
          name: dataName,
          type: "line",
          stack: null,
          smooth: false,
          itemStyle: {
            color: PRODUCT_COLORS[dataName]
          }
        }
      })
    }
  }

  const onChangeTimeRage = (selected, type) => {
    const param = {
      type: "test",
      frequency: frequency,
      displayAsDate
    }
    if (type === "frequency") {
      setFrequency(selected)
      param.frequency = selected
    }
    if (type === "dateRange") {
      setDateRange(selected)
      param.dateRange = selected
    }
  }
  const exportFile = () => {
    const { columns, rows } = tableData
    let rowDataArr = []
    let csvDataObj = ""

    let header = `<thead>`
    let headerRow1 = `<tr>`
    let headerRow2 = `<tr>`
    columns.forEach(col => {
      if (col.id === "date") {
        headerRow1 += `<th>${col.label}</th>`
        headerRow2 += `<th></th>`
        csvDataObj += col.label
      } else {
        headerRow1 += `<th colspan="2">${col.label}</th>`
        headerRow2 += `<th>Target</th><th>Value</th>`
        csvDataObj += `,${col.label} Target, ${col.label} Value`
      }
    })
    csvDataObj += `\r\n`
    headerRow1 += `</tr>`
    headerRow2 += `</tr>`
    header += `${headerRow1}${headerRow2}</thead>`
    let content = `<tbody>`
    rows.forEach(row => {
      let tr = `<tr>`
      let rowData = {}
      Object.keys(row).forEach(item => {
        if (item === "date") {
          tr += `<td>${row["date"]}</td>`
          rowData["Date"] = row["date"]
          csvDataObj += `${row["date"]}`
        } else {
          tr += `<td>${row[item].target}</td><td>${row[item].value}</td>`
          rowData[`${item}-Target`] = row[item].target
          rowData[`${item}-Value`] = row[item].value
          csvDataObj += `,${row[item].target},${row[item].value}`
        }
      })
      tr += `</tr>`
      content += `${tr}`
      rowDataArr.push(rowData)
      csvDataObj += `\r\n`
    })
    content += `</tbody>`
    setXlsData(rowDataArr)
    setCsvData(csvDataObj)
    let tableObj = `<h3>Production</h3><table class="exportFileContent">${header}${content}</table>`
    setPdfData(tableObj)
  }

  return (
    <>
      <div>
        <ChartWithAnnotation
          chartTitle="Production"
          annotations={annotations}
          buId={mill.buId}
          kpiId={kpiId}
          millId={mill.millId}
          chartOptions={selectedPrecessChart}
          processLines={processLines}
          chartHeader={
            <div className="process-line-chart__header">
              <div className="d-flex align-items-center">
                <h2>Production</h2>
              </div>
              <div className="d-flex align-items-center">
                <DateRangePicker
                  placement="auto"
                  className="mr-3"
                  cleanable={false}
                  format="DD MMM YYYY"
                  style={{ minWidth: 170 }}
                  ranges={FILTER_DATE_RANGES}
                  value={dateRange}
                  onChange={value => onChangeTimeRage(value, "dateRange")}
                />
                <InputPicker
                  data={FREQUENCY_SELECT_OPTS}
                  defaultValue={frequency}
                  cleanable={false}
                  onChange={selected => onChangeTimeRage(selected, "frequency")}
                />
              </div>
            </div>
          }
        />
      </div>
      <div className="selected-process-table" ref={tableRef}>
        <div className="text-right">
          {tableData && (
            <Dropdown
              placement="bottomEnd"
              renderTitle={() => {
                return (
                  <IconButton
                    onClick={() => exportFile()}
                    appearance="primary"
                    size="sm"
                    className="mr-2 "
                    icon={<Icon icon="download" />}
                    placement="left"
                  />
                )
              }}
            >
              <ExportDropdownItem
                icon="file-excel-o"
                data={xlsData}
                fileName="Production Table"
                fileType={FILE_TYPE.xls}
                label=".xlsx"
              />
              <ExportDropdownItem
                icon="file-excel-o"
                data={csvData}
                fileName="Production Table"
                fileType={FILE_TYPE.csv}
                label=".csv"
              />
              <ExportDropdownItem
                icon="file-pdf-o"
                data={pdfData}
                columnLength={tableData.columns.length}
                subColumnNum={4}
                fileName="Production Table"
                fileType={FILE_TYPE.pdf}
                label=".pdf"
              />
            </Dropdown>
          )}
        </div>
        <OpexBasicTable tableData={tableData} />
      </div>
    </>
  )
}
ProductionSelectedProcessChartTable.defaultProps = {}

export default ProductionSelectedProcessChartTable
