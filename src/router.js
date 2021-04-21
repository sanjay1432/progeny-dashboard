import Overview from "./views/Overview"
import Dashboard from "./views/pulp/Dashboard"
import Lostcook from "./views/pulp/Lostcook"
import CI from "./views/pulp/CI"
import Benchmark from "./views/pulp/Benchmark"
import ProductionThresholdSetup from "./views/ProductionThresholdSetup"
import OtherKpisThresholdSetup from "views/OtherKpisThresholdSetup"
import { MODULE, BUSINESS_UNIT_LIST } from "./constants"
import Blank from "./components/shared/Blank"
import PowerDashboard from "./views/power/PowerDashboard"
import SPC from "./views/pulp/SPC"
const router = [
  {
    path: "/overview",
    name: "Overview",
    moduleName: MODULE.overview,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    component: Overview,
    children: [
      {
        path: "pulp",
        tab: true,
        name: "Pulp"
      },
      {
        path: "power",
        tab: true,
        name: "Power"
      },
      {
        path: "paper",
        tab: true,
        name: "Paper"
      },
      {
        path: "viscose",
        tab: true,
        name: "Viscose"
      }
    ]
  },
  {
    path: "/main/pulp/dashboard",
    name: "Dashboard",
    icon: "dashboard",
    moduleName: MODULE.dashboard,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    component: Dashboard,
    menu: "main",
    children: [
      {
        path: "summary",
        moduleName: MODULE.summary,
        tab: true,
        name: "Summary"
      },
      {
        path: "production",
        moduleName: MODULE.production,
        tab: true,
        name: "Production"
      },
      {
        path: "chemical",
        moduleName: MODULE.chemical,
        tab: true,
        name: "Chemical"
      },
      {
        path: "utility",
        moduleName: MODULE.utility,
        tab: true,
        name: "Utility"
      },
      {
        path: "wood",
        moduleName: MODULE.wood,
        tab: true,
        name: "Wood"
      },
      {
        path: "quality",
        moduleName: MODULE.quality,
        tab: true,
        name: "Quality"
      }
    ]
  },
  {
    path: "/main/power/dashboard",
    name: "Dashboard",
    icon: "dashboard",
    moduleName: MODULE.dashboard,
    bu: [BUSINESS_UNIT_LIST[1].buId],
    component: PowerDashboard,
    menu: "main",
    children: [
      {
        path: "rb-summary",
        tab: true,
        name: "RB Summary"
      },
      {
        path: "rb-comparison",
        tab: true,
        name: "RB Comparison"
      },
      {
        path: "power-kpi-summary",
        tab: true,
        name: "Power KPI Summary"
      }
    ]
  },
  {
    path: "/main/benchmark",
    name: "Benchmark",
    icon: "related-map",
    moduleName: MODULE.pulpBenchmarking,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    component: Benchmark,
    menu: "main",
    children: [
      {
        path: "kpi-benchmarking",
        tab: true,
        name: "KPI Benchmarking"
      },
      {
        path: "benchmark/projects",
        tab: true,
        name: "Projects"
      }
    ]
  },
  {
    path: "/main/continuous-improvement",
    name: "Continuous Improvement",
    icon: "logo-analytics",
    moduleName: MODULE.pulpContinuousImprovement,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    component: CI,
    menu: "main"
  },
  {
    path: "/main/spc",
    moduleName: MODULE.spc,
    name: "SPC",
    icon: "trend",
    component: SPC,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    menu: "main",
    children: [
      {
        path: "spc-logs",
        tab: true,
        name: "SPC Logs"
      },
      {
        path: "target-definition",
        tab: true,
        name: "Target Definition"
      }
    ]
  },
  {
    path: "/main/lostcook-analytics",
    name: "Lostcook Analytics",
    icon: "pie-chart",
    moduleName: MODULE.lostcookAnalytics,
    bu: [BUSINESS_UNIT_LIST[0].buId],
    component: Lostcook,
    menu: "main",
    children: [
      {
        path: "summary-today",
        tab: true,
        name: "Summary Today"
      },
      {
        path: "summary-overall",
        tab: true,
        name: "Summary Overall"
      },
      {
        path: "lostcook-analysis",
        tab: true,
        name: "Lostcook Analysis"
      },
      {
        path: "textual-analysis",
        tab: true,
        name: "Analytics"
      }
    ]
  },
  {
    name: "Setup",
    icon: "setting",
    moduleName: MODULE.setting,
    bu: [BUSINESS_UNIT_LIST[0].buId, BUSINESS_UNIT_LIST[1].buId],
    menu: "main",
    children: [
      {
        path: "/main/threshold-setup",
        moduleName: MODULE.threshold,
        name: "Threshold Setup",
        menu: "main",
        children: [
          {
            path: "/main/threshold-setup/production",
            component: ProductionThresholdSetup,
            bu: [BUSINESS_UNIT_LIST[0].buId],
            name: "Production",
            children: [
              {
                path: "production-target",
                tab: true,
                name: "Production Target"
              },
              {
                path: "process-line-target",
                tab: true,
                name: "Process Line Target"
              },
              {
                path: "annual-configuration",
                tab: true,
                name: "Annual Configuration"
              }
            ]
          },
          {
            path: "/main/threshold-setup/other-kpis",
            component: OtherKpisThresholdSetup,
            bu: [BUSINESS_UNIT_LIST[0].buId, BUSINESS_UNIT_LIST[1].buId],
            name: "Other KPIs"
          }
        ]
      }
    ]
  }
]

export default router
