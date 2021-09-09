const InitializeState = {
  appReducer: {
    breadcrumb: {},
  },
  authReducer: { isLoggedIn: false, user: null },
  dashboardDataReducer: { result: {} },
  userReducer: { result: {} },
  dashboardReducer: {
    displayAsDate: null,
    latestDate: null,
    processLines: null,
    displayProcessLine: {},
    displayPeriods: []
  },
  trialReducer: {}
}

const KEY = "progeny-app-state"
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
