import { combineReducers } from "redux"
import AppReducer from "./app.reducer"
import { AuthReducer } from "./auth.reducer"
import { MessageReducer } from "./message.reducer"
import { FilterReducer } from "./filter.reducer"
import { DashboardDataReducer } from "./dashboarddata.reducer"
import { ModalDataReducer } from "./modaldata.reducer"
const rootReducer = combineReducers({
  appReducer: AppReducer,
  authReducer: AuthReducer,
  messageReducer: MessageReducer,
  dashboardDataReducer: DashboardDataReducer,
  modalDataReducer: ModalDataReducer,
  filterReducer: FilterReducer
})

export default rootReducer
