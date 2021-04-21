import {
  SET__SAVE__NEW_PRODUCT_LIST_OF_FIBERLINE,
  IS_MODIFIED_CONFIG,
  SET_SAVE_MODIFIED_SUMMARY_COOK_LIST,
  SET__SAVE__MODIFIED_PRODUCT_LIST_OF_FIBERLINE
} from "./types"

export const setSaveNewProductList = saveNewProductList => ({
  type: SET__SAVE__NEW_PRODUCT_LIST_OF_FIBERLINE,
  saveNewProductList
})

export const setSaveModifiedProductList = saveModifiedProductList => ({
  type: SET__SAVE__MODIFIED_PRODUCT_LIST_OF_FIBERLINE,
  saveModifiedProductList
})

export const setModifiedConfig = isModifiedConfig => ({
  type: IS_MODIFIED_CONFIG,
  isModifiedConfig
})

export const setSaveModifiedSummaryCookList = saveModifiedSummaryCookList => ({
  type: SET_SAVE_MODIFIED_SUMMARY_COOK_LIST,
  saveModifiedSummaryCookList
})
