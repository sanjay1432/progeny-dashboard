import React from "react"
import { Loader } from "rsuite"
import GeneralHelper from "../../helper/general.helper"

const ProcessLineGauge = ({ gaugeChart }) => {
  if (gaugeChart == null) {
    return <Loader center content="Loading" />
  }
  return (
    <>
      <div className="opex_chart gauge">
        <h2 className="text-left">
          {gaugeChart.name}
          <small> ADt/d</small>
        </h2>
        <div className="gauge_chart">
          {GeneralHelper.buildGaugeChart({
            min: Number.parseInt(gaugeChart.min),
            value: Number.parseFloat(
              Number.parseFloat(gaugeChart.value).toFixed(0)
            ),
            threshold: Number.parseInt(gaugeChart.threshold),
            max: Number.parseInt(gaugeChart.max)
          })}
        </div>
      </div>
    </>
  )
}

export default ProcessLineGauge
