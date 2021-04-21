import {
  SET_DISPLAY_AS_DATE,
  SET_DISPLAY_PERIODS,
  SET_DISPLAY_PROCESS_LINE,
  SET_LATEST_DATE,
  SET_PROCESS_LINE
} from "./types"

export const setDisplayPeriods = displayPeriods => ({
  type: SET_DISPLAY_PERIODS,
  displayPeriods
})
export const setDisplayProcessLine = displayProcessLine => ({
  type: SET_DISPLAY_PROCESS_LINE,
  displayProcessLine
})

export const setDisplayAsDate = displayAsDate => ({
  type: SET_DISPLAY_AS_DATE,
  displayAsDate
})

export const setLatestDate = latestDate => ({
  type: SET_LATEST_DATE,
  latestDate
})

export const setProcessLines = processLines => ({
  type: SET_PROCESS_LINE,
  processLines
})
