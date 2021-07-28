import { PATTERN_COLORS } from "../constants/index"
import moment from "moment"
import React from "react"
import { Icon, IconButton, Loader, Table } from "rsuite"
// import GeneralService from "../services/general.service"
import classnames from "classnames"
const { Cell } = Table

const generateArrayOfYears = (plusYearFromThisYear = 5) => {
  var min = new Date().getFullYear()
  let max = min + plusYearFromThisYear
  let years = []
  for (var i = min - plusYearFromThisYear - 1; i <= max; i++) {
    years.push({
      label: i,
      value: i
    })
  }
  return years
}

const modifyDate = ({date})=>{
  const someday = moment(date);
  return someday.format('MMM - DD');
}
const chartDateFormatter = value => {
  // Formatted to be month/day; display year only in the first label
  if (value && value.toString().length <= 4) {
    return value
  }
  const date = moment(value)
  if (date.isValid()) {
    return date.format("DD MMM")
  } else {
    return value
  }
}

const chartDateFormatterAnnotation = (annotations, value) => {
  const date = moment(value)
  let style = "normal"
  if (date.isValid() && annotations) {
    const index = annotations.indexOf(date.format("YYYY-MM-DD"))
    if (index >= 0) {
      style = "annotation"
    }
  }
  return "{" + style + "|" + GeneralHelper.chartDateFormatter(value) + "}"
}

const DateCell = ({ rowData, dataKey, ...props }, format = "DD MMM YYYY") => {
  return <Cell {...props}>{moment(rowData[dataKey]).format(format)}</Cell>
}

const BuCell = ({ rowData, dataKey, ...props }) => {
  const isDefault = rowData.isDefault === true
  return (
    <Cell {...props}>
      <span
        className={classnames("table-cell", {
          "font-weight-700": isDefault
        })}
      >
        {rowData[dataKey].buName} {isDefault ? "(default)" : ""}
      </span>
    </Cell>
  )
}

const ReadMoreCell = (
  { rowData, dataKey, ...props },
  setReadmore,
  setSelectedRow
) => {
  return (
    <Cell {...props} className="__action_col">
      <div className="d-flex justify-content-space-center align-items-center">
        <IconButton
          onClick={() => {
            setReadmore(true)
            setSelectedRow(rowData)
          }}
          size="sm"
          icon={<Icon icon="eye" />}
        />
      </div>
    </Cell>
  )
}

const loadingOnDialog = () => {
  return (
    <div style={{ textAlign: "center", height: "100vh" }}>
      <Loader size="md" />
    </div>
  )
}

const buildDisplayName = (firstName, lastName, userName) => {
  if (firstName === "" && lastName === "") {
    return userName
  }
  return `${firstName} ${lastName}`
}

const sortDataByStartDate = data => {
  return data.sort((a, b) => {
    return moment(moment(a["startDate"]).format("DD MMM YYYY")).diff(
      moment(b["startDate"]).format("DD MMM YYYY")
    )
  })
}

const getColorOfPattern = pattern => {
  switch (pattern.toLowerCase()) {
    case "p1":
      return PATTERN_COLORS.p1
    case "p2":
      return PATTERN_COLORS.p2
    case "p3":
      return PATTERN_COLORS.p3
    case "p4":
      return PATTERN_COLORS.p4
    case "p5":
      return PATTERN_COLORS.p5
    case "p6":
      return PATTERN_COLORS.p6
    case "p7":
      return PATTERN_COLORS.p7
    case "p8":
      return PATTERN_COLORS.p8
    default:
      return "blue"
  }
}

const timeToMinutes = time => {
  var a = time.split(":")
  return +a[0] * 60 + +a[1]
}

const minutesToTime = n => {
  var num = n
  var hours = num / 60
  var rhours = Math.floor(hours)
  var minutes = (hours - rhours) * 60
  var rminutes = Math.round(minutes)
  return rhours + " h " + rminutes + "m"
}

const GeneralHelper = {
  generateArrayOfYears,
  chartDateFormatter,
  chartDateFormatterAnnotation,
  DateCell,
  BuCell,
  buildDisplayName,
  ReadMoreCell,
  loadingOnDialog,
  sortDataByStartDate,
  getColorOfPattern,
  timeToMinutes,
  minutesToTime,
  modifyDate
}

export default GeneralHelper
