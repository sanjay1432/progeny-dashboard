import { MODALDATA_SUCCESS, MODALDATA_FAIL } from "../actions/types"
import StateLoader from "../StateLoader"
const stateLoader = new StateLoader()

export const ModalDataReducer = (state = stateLoader.loadStateByReducer(""))
