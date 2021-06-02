import moment from "moment"
import GeneralHelper from "../helper/general.helper"
export const DEBUG = process.env.REACT_APP_DEBUG || "false"
export const API_URL = process.env.REACT_APP_API_URL || "no-api"
export const API_TOKEN = process.env.REACT_APP_API_TOKEN || "no-api"
export const API_URL_MOCK = process.env.REACT_APP_API_URL_MOCK || "no-api"
export const API_LOSTCOOK_URL = process.env.REACT_APP_LOSTCOOK_API_URL
export const SPC_API_URL = process.env.REACT_APP_SPC_API_URL
export const SSO_WEB_LOGIN = process.env.REACT_APP_SSO_WEB_LOGIN || "/"
export const CANCEL_REQUEST = "CANCEL_REQUEST"
export const TOKEN_NAME = "PROGENY_TOKEN"
export const REFRESH_TOKEN_NAME = "PROGENY_REFRESH_TOKEN"
export const BASE_NAME = process.env.REACT_APP_BASE_NAME || ""
export const DASHBOARD_VERSION = process.env.REACT_APP_VERSION || ""
export const MODULE = {
  application: "application",
  overview: "overview",
  dashboard: "dashboard",
  summary: "summary",
  production: "production",
  chemical: "chemical",
  utility: "utility",
  wood: "wood",
  quality: "quality",
  pulpBenchmarking: "pulp-benchmarking",
  pulpContinuousImprovement: "pulp-continuous-improvement",
  lostcookAnalytics: "lostcook-analytics",
  finance: "finance",
  recoveryBoiler: "recovery-boiler",
  powerKpi: "power-kpi",
  powerBenchmarking: "power-benchmarking",
  powerContinuousImprovement: "power-continuous-improvement",
  setting: "setting",
  threshold: "threshold",
  annotation: "annotation",
  ciProjects: "ci-projects",
  lcTarget: "lc-target",
  lcIncident: "lc-incident",
  lcCookNumber: "lc-cook-number",
  powerDashboard: "powerDashboard",
  rbSummary: "rbSummary",
  rbComparison: "rbComparison",
  powerKpiSummary: "powerKpiSummary",
  spc: "spc",
  spcLogs: "spcLogs",
  spcTargetDefinition: "spcTargetDefinition"
}

export const ACTION = {
  access: "access", //=> access = read + add + edit => all permission
  read: "read",
  edit: "edit",
  add: "add",
  modify: "modify"
}
export const ROLE_NAME = {
  C01: {
    roleCode: "C01",
    roleName: "Directors"
  },
  C02: {
    roleCode: "C02",
    roleName: "President"
  },
  C03: {
    roleCode: "C03",
    roleName: "COO"
  },
  C04: {
    roleCode: "C04",
    roleName: "Senior Management"
  },
  C05: {
    roleCode: "C05",
    roleName: "Finance Controller"
  },
  C06: {
    roleCode: "C06",
    roleName: "MOS Managerz"
  },
  C07: {
    roleCode: "C07",
    roleName: "BCID Manager"
  },
  C08: {
    roleCode: "C08",
    roleName: "System Admin"
  },
  LC01: {
    roleCode: "LC01",
    roleName: "LC Superuser"
  },
  LC02: {
    roleCode: "LC02",
    roleName: "LC Admin"
  },
  LC03: {
    roleCode: "LC03",
    roleName: "LC User"
  },
  BU01: {
    roleCode: "BU01",
    roleName: "BU Head"
  },
  BU02: {
    roleCode: "BU02",
    roleName: "Technical Support"
  },
  BU03: {
    roleCode: "BU03",
    roleName: "Production Manager"
  },
  BU04: {
    roleCode: "BU04",
    roleName: "Technical Manager"
  },
  BU05: {
    roleCode: "BU05",
    roleName: "Process Engineer"
  },
  BU06: {
    roleCode: "BU06",
    roleName: "Supervisor"
  },
  BU07: {
    roleCode: "BU07",
    roleName: "Team Leader"
  },
  BU08: {
    roleCode: "BU08",
    roleName: "Automation"
  },
  BU09: {
    roleCode: "BU09",
    roleName: "BCID"
  }
}
export const BUSINESS_UNIT_LIST = [
  {
    buId: 1,
    buName: "Pulp",
    buCode: "PUK",
    buTypeId: 1
  },
  {
    buId: 4,
    buName: "Power",
    buCode: "POW",
    buTypeId: 3
  }
]

export const BPI = [
  {
    label: "Lower Better",
    value: -1
  },
  {
    label: "Higher Better",
    value: 1
  },
  {
    label: "Within Range",
    value: 0
  },
  {
    label: "No Indictor",
    value: 99
  }
]

export const CONFIG_TYPE = {
  production: "production",
  processLine: "processLine",
  annual: "annual"
}

//TODO
export const MILL_LIST = [
  {
    millId: 1,
    millCode: "KRC",
    countryId: 1,
    buId: 1,
    logo: "Kerinci",
    name: "Kerinci",
    productions: ["kp", "ae"]
  },
  {
    millId: 2,
    millCode: "TPL",
    countryId: 1,
    buId: 1,
    logo: "TPL",
    name: "TPL Toba",
    productions: ["default"]
  },
  {
    millId: 3,
    countryId: 2,
    millCode: "RZH",
    buId: 1,
    logo: "Rizhao",
    name: "Rizhao",
    productions: ["default"]
  },
  {
    millId: 5,
    millCode: "BSC",
    countryId: 3,
    buId: 1,
    logo: "Bahia",
    name: "Bahia",
    productions: ["default"]
  }
]

export const PRODUCTION_TYPES = {
  default: {
    label: "DEFAULT",
    value: "default"
  },
  ae: {
    label: "AE",
    value: "ae"
  },
  kp: {
    label: "KP",
    value: "kp"
  }
}

export const VIEW_TYPE = {
  chart: "chart",
  table: "table"
}

export const FILE_TYPE = {
  xls:
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
  pdf: "pdf",
  csv: "text/csv;charset=utf-8"
}

export const KPI_CATEGORIES = {
  production: {
    kpiCategoryId: 1,
    kpiCategoryName: "Production"
  },
  chemical: {
    kpiCategoryId: 2,
    kpiCategoryName: "Chemical"
  },
  utility: {
    kpiCategoryId: 3,
    kpiCategoryName: "Utility"
  },
  wood: {
    kpiCategoryId: 4,
    kpiCategoryName: "Wood"
  },
  quality: {
    kpiCategoryId: 5,
    kpiCategoryName: "Quality"
  },
  recoveryBoiler: {
    kpiCategoryId: 6,
    kpiCategoryName: "Recovery Boiler"
  },
  powerKpi: {
    kpiCategoryId: 7,
    kpiCategoryName: "Power KPI"
  }
}

export const KPI_CATEGORIES_NAME = [
  "Key Performance Indicator Summary",
  "Daily Production by Fiberline",
  "Chemical",
  "Utility",
  "Wood",
  "Quality"
]

export const MILL_INFO = {
  kerinci: {
    millId: 1,
    countryId: 1,
    millCode: "KRC",
    buId: 1,
    logo: "Kerinci",
    name: "Kerinci",
    productions: ["kp", "ae"]
  },
  tpl: {
    millId: 2,
    millCode: "TPL",
    countryId: 1,
    buId: 1,
    logo: "TPL",
    name: "TPL Toba",
    productions: ["default"]
  },
  rizhao: {
    millId: 3,
    millCode: "RZH",
    countryId: 2,
    buId: 1,
    logo: "Rizhao",
    name: "Rizhao",
    productions: ["default"]
  },
  bahia: {
    millId: 5,
    countryId: 3,
    millCode: "BSC",
    buId: 1,
    logo: "Bahia",
    name: "Bahia",
    productions: ["default"]
  },
  kerinciPower: {
    millId: 1,
    countryId: 1,
    millCode: "KRC",
    buId: 4,
    logo: "Kerinci",
    name: "Kerinci",
    productions: ["kp", "ae"]
  },
  rizhaoPower: {
    millId: 3,
    millCode: "RZH",
    countryId: 2,
    buId: 4,
    logo: "Rizhao",
    name: "Rizhao",
    productions: ["default"]
  }
}

export const FREQUENCY_SELECT_OPTS = [
  { value: "daily", label: "Daily" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" }
]

export const TIME_SELECT_OPTS = [
  { value: "last-month", label: "Last month" },
  { value: "last-3-months", label: "Last 3 months" },
  { value: "last-6-months", label: "Last 6 months" }
]

export const PRODUCT_COLORS = {
  FL1: "#2581c5",
  FL2: "#48D358",
  "FL2-AE": "#32943e",
  FL3: "#F7C31A",
  PCD: "#660000",
  PD1: "#9933FF",
  PD2: "#99FF99",
  PD3: "#eded39",
  PD4: "#FF9999",
  PL11: "#2581c5",
  PL12: "#48D358",
  LN1: "#2581c5",
  LN2: "#48D358",
  Target: "#002c86"
}

export const PATTERN_COLORS = {
  p1: "#CC3300",
  p2: "#FF9966",
  p3: "#E9D971",
  p4: "#ACA159",
  p5: "#FF5700",
  p6: "#887600",
  p7: "#9FE48A",
  p8: "#50B432"
}

export const MILL_COLORS = {
  KRC: "#A4A1FB",
  TPL: "#E0E347",
  RZH: "#5FE3A1",
  BHA: "#56D9FE"
}

export const FILTER_DATE_RANGES = [
  {
    label: "Last 14 Days",
    value: [moment().startOf("day").add(-13, "days"), moment().endOf("day")]
  },
  {
    label: "Last 30 Days",
    value: [moment().startOf("day").add(-29, "days"), moment().endOf("day")]
  },
  {
    label: "Last 90 Days",
    value: [moment().startOf("day").add(-89, "days"), moment().endOf("day")]
  }
]

export const LINE_CHART_OPTION = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    right: 0
  },
  grid: {
    top: "30px",
    left: "1%",
    right: "30px",
    bottom: "0px",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: [],
    axisLabel: {
      show: true,
      showMaxLabel: true,
      rotate: 90,
      formatter: (value, index) => GeneralHelper.chartDateFormatter(value),
      rich: {
        annotation: {
          color: "red",
          fontWeight: "bold"
        }
      }
    }
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: {
        color: "#EAF0F4"
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: [
    {
      name: "",
      type: "line",
      smooth: false,
      itemStyle: {
        color: "#D2207F"
      },
      data: [],
      markLine: {
        lineStyle: {
          color: "#707070",
          type: "solid"
        },
        label: {
          show: true,
          position: "insideStartTop"
        },
        symbol: "none",
        tooltip: {
          trigger: "axis"
        }
      }
    },
    {
      name: "",
      type: "line",
      smooth: false,
      itemStyle: {
        color: "#3979EF"
      },
      data: []
    }
  ]
}

export const BAR_CHART_OPTION = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow"
    }
  },
  legend: {
    left: "center",
    show: false
  },
  grid: {
    top: "30px",
    left: "1%",
    right: "30px",
    bottom: "0px",
    containLabel: true
  },
  xAxis: {
    type: "category",
    boundaryGap: true,
    data: [],
    axisLabel: {
      show: true,
      rotate: 0,
      formatter: function (value, index) {
        // Formatted to be month/day; display year only in the first label
        return moment(value).format("MMM")
      }
    }
  },
  yAxis: {
    type: "value",
    splitLine: {
      lineStyle: {
        color: "#EAF0F4"
      }
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  series: [
    {
      name: "",
      type: "bar",
      smooth: false,
      itemStyle: {
        color: "#D2207F"
      },
      data: [],
      markLine: {
        data: [
          {
            name: "Horizontal line with Y value at 180",
            yAxis: 180
          }
        ],
        lineStyle: {
          color: "#707070",
          type: "solid"
        },
        label: {
          show: true,
          position: "insideStartTop"
        },
        symbol: "none",
        tooltip: {
          trigger: "axis"
        }
      }
    },
    {
      name: "",
      type: "bar",
      smooth: false,
      itemStyle: {
        color: "#3979EF"
      },
      data: []
    }
  ]
}

export const BOX_PLOT_CHART_OPTION = {
  color: ["#9de7a5"],
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow"
    }
  },
  grid: {
    left: "10%",
    right: "10%",
    bottom: "15%"
  },
  xAxis: {
    type: "category",
    data: [],
    boundaryGap: true,
    nameGap: 30,
    splitArea: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: true,
      formatter: "expr {value}"
    },
    splitLine: {
      show: false
    },
    axisLine: {
      show: false
    }
  },
  yAxis: {
    type: "value",
    splitArea: {
      show: false
    },
    axisLine: {
      show: true
    },
    min: function (value) {
      return Number(value.min - 0.1).toFixed(1)
    },
    max: function (value) {
      return Number(value.max + 0.1).toFixed(1)
    }
  },
  series: [
    {
      name: "boxplot",
      type: "boxplot",
      itemStyle: {
        color: "#76DE82"
      },
      data: [],
      tooltip: {
        formatter: function (param) {
          return [
            '<span style="font-size: 0.75rem">Q3: ' + param.data[4] + "</span>",
            '<span style="font-size: 0.75rem">Median: ' +
              param.data[3] +
              "</span>",
            '<span style="font-size: 0.75rem">Q1: ' + param.data[2] + "</span>"
          ].join("<br/>")
        }
      }
    }
    // {
    //     name: 'outlier',
    //     type: 'scatter',
    //     data: data.outliers
    // }
  ]
}
