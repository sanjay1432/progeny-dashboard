import thunkMiddleware from "redux-thunk"
import rootReducer from "./reducers/index"
import { configureStore } from "@reduxjs/toolkit"
import { DEBUG } from "../constants"

const loggerMiddleware = store => next => action => {
  // console.group(action.type)
  // console.info("dispatching", action)
  let result = next(action)
  // console.log("next state", store.getState())
  console.groupEnd()
  return result
}

const round = number => Math.round(number * 100) / 100

const monitorReducerEnhancer = createStore => (
  reducer,
  initialState,
  enhancer
) => {
  const monitoredReducer = (state, action) => {
    const start = performance.now()
    const newState = reducer(state, action)
    const end = performance.now()
    const diff = round(end - start)

    // console.log("reducer process time:", diff)

    return newState
  }

  return createStore(monitoredReducer, initialState, enhancer)
}

function configureAppStore() {
  let middleware = [thunkMiddleware]
  let enhancers = []
  if (DEBUG === "true") {
    middleware.push(loggerMiddleware)
    enhancers.push(monitorReducerEnhancer)
  }
  return configureStore({
    reducer: rootReducer,
    middleware: middleware,
    enhancers: enhancers
  })
}

export default configureAppStore()
