import { combineReducers } from "redux"
import AppReducer from "./app.reducer"
import { AuthReducer } from "./auth.reducer"
import { MessageReducer } from "./message.reducer"
import { FilterReducer } from "./filter.reducer"
import { DashboardDataReducer } from "./dashboarddata.reducer"
import { TrialReducer } from "./trial.reducer"
const rootReducer = combineReducers({
  appReducer: AppReducer,
  authReducer: AuthReducer,
  messageReducer: MessageReducer,
  dashboardDataReducer: DashboardDataReducer,
  filterReducer: FilterReducer,
  trialReducer: TrialReducer
})

export default rootReducer
