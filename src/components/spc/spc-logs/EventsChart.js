import React, { useEffect, useState } from "react"
import _ from "lodash"
import BasicCardContainer from "../../shared/BasicCardContainer"
import EchartOpex from "../../shared/EchartOpex"
import { PATTERN_COLORS } from "../../../constants"
import GeneralHelper from "../../../helper/general.helper"

const PIE_CHART_OPTION = {
  legend: null,
  series: [
    {
      name: "",
      type: "pie",
      avoidLabelOverlap: false,
      data: [],
      label: {
        show: true,
        formatter: "{b}: {c}"
      },
      selectedMode: "single",
      itemStyle: {
        color: param => {
          return GeneralHelper.getColorOfPattern(param.data.name.toLowerCase())
        }
      }
    }
  ]
}
const EventsChart = ({ data, title }) => {
  const [occurrence, setOccurrence] = useState(null)
  const [duration, setDuration] = useState(null)
  const [selectedChart, setSelectedChart] = useState("occurrence")
  useEffect(() => {
    if (data) {
      const occurrenceOption = _.cloneDeep(PIE_CHART_OPTION)
      const durationOption = _.cloneDeep(PIE_CHART_OPTION)
      data.forEach(item => {
        occurrenceOption.series[0].data.push({
          value: item.occurrence,
          name: item.pattern
        })
        durationOption.series[0].data.push({
          value: GeneralHelper.timeToMinutes(item.duration),
          name: item.pattern
        })
        durationOption.series[0].label.formatter = (param)=>{
          console.log(param)
          return `${param.name} : ${GeneralHelper.minutesToTime(param.value)}`
        }
      })

      setOccurrence(occurrenceOption)
      setDuration(durationOption)
    }
  }, [data])
  return (
    <BasicCardContainer bg="dark">
      <h2>{title}</h2>
      <EchartOpex
        chartTitle="Number of occurrence"
        notMerge={true}
        option={selectedChart === "duration" ? duration : occurrence || {}}
        style={{ height: "350px" }}
        chartHeader={
          <div className="d-flex align-items-center flex-wrap">
            <div
              className="custom-control opex-radio custom-radio"
              onClick={() => setSelectedChart("occurrence")}
            >
              <input
                className="custom-control-input"
                value="ytd"
                name="chartType"
                type="radio"
                checked={selectedChart === "occurrence"}
                onChange={() => setSelectedChart("occurrence")}
              />
              <label className="custom-control-label" htmlFor="customRadio2">
                <span>Number of occurrence</span>
              </label>
            </div>

            <div
              className="custom-control opex-radio custom-radio"
              onClick={() => setSelectedChart("duration")}
            >
              <input
                className="custom-control-input"
                value="mtd"
                name="chartType"
                type="radio"
                checked={selectedChart === "duration"}
                onChange={() => setSelectedChart("duration")}
              />
              <label className="custom-control-label" htmlFor="customRadio1">
                <span>Duration of time</span>
              </label>
            </div>
          </div>
        }
      />
    </BasicCardContainer>
  )
}

export default EventsChart
