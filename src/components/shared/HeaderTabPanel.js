import React, { useEffect } from "react"
import ProductionHelper from "../../helper/production.helper"
import { useSelector } from "react-redux"
import moment from "moment"
import { CANCEL_REQUEST } from "../../constants"
import axios from "axios"

const HeaderTabPanel = ({ filterBy = "" }) => {
  const latestDate = useSelector(state => state.dashboardReducer.latestDate)
  const processLines = useSelector(state => state.dashboardReducer.processLines)

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [])

  return (
    <>
      <div className="__header">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div className="product_square_boxes">
            {processLines &&
              processLines
                .filter(item =>
                  item.processLineCode.toUpperCase().startsWith(filterBy)
                )
                .map((item, index) => {
                  return ProductionHelper.buildProcessLine(item, index)
                })}
          </div>
          <p className="info_box mb-0">
            <i className="fa fa-exclamation-circle" /> Latest date available:{" "}
            <strong>{moment(latestDate).format("DD MMM YYYY")}.</strong> Next
            update: <strong>Tomorrow at 8:30AM</strong>
          </p>
        </div>
      </div>
    </>
  )
}

export default HeaderTabPanel
