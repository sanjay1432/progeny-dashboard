import { SET_TRIAL, CLEAR_TRIAL } from "./types"

export const setTrialState = trial => ({
  type: SET_TRIAL,
  payload: trial
})

export const clearTrialState = () => ({
  type: CLEAR_TRIAL
})
