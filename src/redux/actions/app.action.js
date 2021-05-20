import { SET_BREADCRUMB, CLEAR_BREADCRUMB } from "./types"

export const setBreadcrumb = breadcrumb => ({
  type: SET_BREADCRUMB,
  breadcrumb
})

export const clearBreadcrumb = () => ({
  type: CLEAR_BREADCRUMB
})
