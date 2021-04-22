import { combineReducers } from "redux"
import AppReducer from "./app.reducer"
import { AuthReducer } from "./auth.reducer"
import { MessageReducer } from "./message.reducer"

const rootReducer = combineReducers({
  appReducer: AppReducer,
  authReducer: AuthReducer,
  messageReducer: MessageReducer
})

export default rootReducer
