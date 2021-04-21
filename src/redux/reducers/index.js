import { combineReducers } from "redux"
import AppReducer from "./app.reducer"
import { AuthReducer } from "./auth.reducer"
import { MessageReducer } from "./message.reducer"
import DashboardReducer from "./dashboard.reducer"
import LostcookReducer from "./lostcook.reducer"
import LostcookSummaryTodayReducer from "./lostcookSummaryToday.reducer"

const rootReducer = combineReducers({
  appReducer: AppReducer,
  authReducer: AuthReducer,
  messageReducer: MessageReducer,
  dashboardReducer: DashboardReducer,
  lostcookReducer: LostcookReducer,
  lostcookSummaryTodayReducer: LostcookSummaryTodayReducer
})

export default rootReducer
