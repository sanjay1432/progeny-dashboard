const InitializeState = {
  appReducer: {
    mill: {
      millId: 1,
      millCode: "KRC",
      buId: 1,
      logo: "Kerinci",
      name: "Kerinci",
      countryId: 1
    },
    mills: null,
    breadcrumb: ["Dashboard", "Production"],
    expandChart: {
      show: false,
      data: {},
      title: "Chart"
    }
  },
  authReducer: { isLoggedIn: false, user: null },
  dashboardReducer: {
    displayAsDate: null,
    latestDate: null,
    processLines: null,
    displayProcessLine: {},
    displayPeriods: []
  },
  lostcookReducer: {
    fiberlines: [],
    lcAnalysisFilteredTable: null,
    lcAnalysisTable: null,
    selectedDateOnBarChart: null,
    selectedTypeOnPieChart: null
  },
  lostcookSummaryTodayReducer: {
    saveNewProductList: [],
    saveModifiedProductList: [],
    isModifiedConfig: false,
    saveModifiedSummaryCookList: []
  }
}

const KEY = "opex-app-state"
class StateLoader {
  loadState() {
    try {
      let serializedState = localStorage.getItem(KEY)

      if (serializedState === null) {
        return this.initializeState()
      }

      return JSON.parse(serializedState)
    } catch (err) {
      return this.initializeState()
    }
  }

  loadStateByReducer(reducerName) {
    try {
      let serializedState = localStorage.getItem(KEY)

      if (serializedState === null) {
        return this.initializeState()[reducerName]
      }

      return JSON.parse(serializedState)[reducerName]
    } catch (err) {
      console.log(err)
      return this.initializeState()[reducerName]
    }
  }

  saveState(state) {
    try {
      let serializedState = JSON.stringify(state)
      localStorage.setItem(KEY, serializedState)
    } catch (err) {}
  }

  initializeState() {
    return InitializeState
  }
}

export default StateLoader
