import { SET_FILTER,SET_RESET, CLEAR_FILTER } from "./types"

export const setFilter = filter => ({
  type: SET_FILTER,
  payload: filter
})
export const setResetFilter = () => ({
  type: SET_RESET
})
export const clearFilter = () => ({
  type: CLEAR_FILTER
})
