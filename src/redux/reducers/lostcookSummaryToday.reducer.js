import {
  SET__SAVE__NEW_PRODUCT_LIST_OF_FIBERLINE,
  IS_MODIFIED_CONFIG,
  SET_SAVE_MODIFIED_SUMMARY_COOK_LIST,
  SET__SAVE__MODIFIED_PRODUCT_LIST_OF_FIBERLINE
} from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

const LostcookSummaryTodayReducer = (
  state = stateLoader.loadStateByReducer("lostcookSummaryTodayReducer"),
  action
) => {
  switch (action.type) {
    case SET__SAVE__NEW_PRODUCT_LIST_OF_FIBERLINE:
      return {
        ...state,
        saveNewProductList: action.saveNewProductList
      }
    case SET__SAVE__MODIFIED_PRODUCT_LIST_OF_FIBERLINE:
      return {
        ...state,
        saveModifiedProductList: action.saveModifiedProductList
      }
    case IS_MODIFIED_CONFIG:
      return {
        ...state,
        isModifiedConfig: action.isModifiedConfig
      }
    case SET_SAVE_MODIFIED_SUMMARY_COOK_LIST:
      return {
        ...state,
        saveModifiedSummaryCookList: action.saveModifiedSummaryCookList
      }
    default:
      return state
  }
}

export default LostcookSummaryTodayReducer
