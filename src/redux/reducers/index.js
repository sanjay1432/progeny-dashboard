import { combineReducers } from "redux"
import AppReducer from "./app.reducer"
import { AuthReducer } from "./auth.reducer"
import { MessageReducer } from "./message.reducer"
import { FilterReducer } from "./filter.reducer"
import { DashboardDataReducer } from "./dashboarddata.reducer"
import { PositionReducer } from "./userManagement.reducer"

const rootReducer = combineReducers({
  appReducer: AppReducer,
  authReducer: AuthReducer,
  messageReducer: MessageReducer,
  dashboardDataReducer: DashboardDataReducer,
  filterReducer: FilterReducer,
  positionReducer: PositionReducer
})

export default rootReducer
