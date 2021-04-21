import {
  CANCEL_REQUEST,
  KPI_CATEGORIES,
  PATTERN_COLORS,
  PRODUCTION_TYPES
} from "../constants/index"
import moment from "moment"
import React from "react"
import {
  Alert,
  Col,
  Grid,
  Icon,
  IconButton,
  Loader,
  Placeholder,
  Row,
  Table
} from "rsuite"
import GeneralService from "../services/general.service"
import ReactSpeedometer from "react-d3-speedometer"
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

const getProductionTypes = (millId = 1) => {
  switch (millId) {
    case 2:
    case 3:
    case 5:
      return [PRODUCTION_TYPES.default]

    default:
      return [
        PRODUCTION_TYPES.default,
        PRODUCTION_TYPES.ae,
        PRODUCTION_TYPES.kp
      ]
  }
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

const getMillListBaseOnRoles = (mills, roles, buId) => {
  const temArr = roles
    .filter(item => (buId ? item.buId === buId : true))
    .map(role => role.millId)

  const millArray = temArr.filter(
    (value, index) => temArr.indexOf(value) === index
  )
  return mills.filter(mill => {
    return millArray.indexOf(mill.mill_id) >= 0
  })
}

const getKpiList = (mill, kpiCategoryId, source, setKpiState) => {
  const param = {
    buId: mill.buId,
    millId: mill.millId,
    kpiCategoryIds: [kpiCategoryId]
  }
  GeneralService.getKpis(param, source).then(
    data => {
      setKpiState(data)
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

const buildGaugeChart = (gaugeChart, index = 1, width = 250) => {
  const min = gaugeChart.min || 0
  const value = gaugeChart.value
  const threshold = gaugeChart.threshold
  let max = gaugeChart.max || gaugeChart.maximum
  if (isNaN(Number.parseInt(max))) {
    max = min
  }
  if (!gaugeChart) {
    return <Placeholder.Paragraph rows={3} />
  }
  return (
    <div className="opex_card __general" key={index}>
      <div className="opex_chart gauge gauge-general">
        <div className="__chart-container" style={{ width: width }}>
          <ReactSpeedometer
            forceRender={true}
            maxSegmentLabels={0}
            segments={3}
            maxValue={max}
            minValue={min}
            customSegmentStops={[min, threshold * 0.95, threshold, max]}
            segmentColors={["#FE4831", "#ffbc38", "#218630"]}
            value={Number.parseFloat(Number.parseFloat(value).toFixed(0))}
            valueTextFontSize={"29px"}
            textColor={"#43425D"}
            paddingVertical={18}
            needleColor="#434343"
            needleHeightRatio={0.55}
            ringWidth={30}
            fluidWidth={true}
          />
          <Grid fluid className="__numbers-custom">
            <div className="__numbers-custom-value">
              <p className="text-left">{min}</p>
              <h1 className="text-center">
                {Number.parseFloat(Number.parseFloat(value).toFixed(0))}
              </h1>
              <p className="text-right">{max}</p>
            </div>
            {gaugeChart.name && (
              <Row>
                <Col md={24}>
                  <h2 className="text-center">{gaugeChart.name}</h2>
                </Col>
              </Row>
            )}
          </Grid>
        </div>
      </div>
    </div>
  )
}

const buildDisplayName = (firstName, lastName, userName) => {
  if (firstName === "" && lastName === "") {
    return userName
  }
  return `${firstName} ${lastName}`
}

const getKpiCategoryListByBUID = buId => {
  if (buId === 4) {
    return [KPI_CATEGORIES.recoveryBoiler, KPI_CATEGORIES.powerKpi]
  } else {
    return [
      KPI_CATEGORIES.chemical,
      KPI_CATEGORIES.utility,
      KPI_CATEGORIES.wood,
      KPI_CATEGORIES.quality
    ]
  }
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

const timeToMinutes = (time)=>{
  var a = time.split(':');
  return (+a[0]) * 60 + (+a[1]); 
}

const minutesToTime =(n) =>{
  var num = n;
  var hours = (num / 60);
  var rhours = Math.floor(hours);
  var minutes = (hours - rhours) * 60;
  var rminutes = Math.round(minutes);
  return  rhours + " h " + rminutes + "m";
  }

const GeneralHelper = {
  generateArrayOfYears,
  getProductionTypes,
  chartDateFormatter,
  chartDateFormatterAnnotation,
  DateCell,
  getKpiList,
  buildGaugeChart,
  getMillListBaseOnRoles,
  BuCell,
  getKpiCategoryListByBUID,
  buildDisplayName,
  ReadMoreCell,
  loadingOnDialog,
  sortDataByStartDate,
  getColorOfPattern,
  timeToMinutes,
  minutesToTime
}

export default GeneralHelper
