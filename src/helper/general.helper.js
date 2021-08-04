import moment from "moment"
import React from "react"
import { Loader, Table } from "rsuite"
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
  buildDisplayName,
  loadingOnDialog,
  timeToMinutes,
  minutesToTime,
  modifyDate
}

export default GeneralHelper
