import React from "react"
const transform = (
  data,
  oriValue,
  compareValue,
  betterPerformance = 99,
  showData = true
) => {
  const lowerArrowColor = betterPerformance < 0 ? "green" : "red"
  const higherArrowColor = betterPerformance < 0 ? "red" : "green"
  let html

  let diff = 0
  if (betterPerformance === 0 && Array.isArray(compareValue)) {
    if (compareValue.length === 1) {
      compareValue.push(compareValue[0])
    }
    if (data <= compareValue[0]) {
      diff = -1
    }
    if (data >= compareValue[1]) {
      diff = 1
    }
  } else {
    diff = +oriValue - +compareValue
  }

  if (
    data === undefined ||
    data === "-" ||
    data === "NaN" ||
    data === "N/A" ||
    data === null
  ) {
    return <span>{showData ? data : ""}</span>
  }

  if (betterPerformance === 0) {
    if (Array.isArray(compareValue)) {
      if (diff === 0) {
        html = <span style={{ color: "green" }}>{showData ? data : ""}</span>
      } else if (diff > 0) {
        html = (
          <span style={{ color: "red" }}>
            {showData ? data : ""} <i className="fa fa-caret-up"></i>
          </span>
        )
      } else if (diff < 0) {
        html = (
          <span style={{ color: "red" }}>
            {showData ? data : ""} <i className="fa fa-caret-down"></i>
          </span>
        )
      }
    } else {
      html = showData ? data : ""
    }
  } else if (+diff === 0 || betterPerformance === 99) {
    html = showData ? data : ""
  } else {
    if (+diff < 0) {
      html = (
        <span style={{ color: lowerArrowColor }}>
          {showData ? data : ""}
          <i className="fa fa-caret-down fa-fw"></i>
        </span>
      )
    } else {
      html = (
        <span style={{ color: higherArrowColor }}>
          {showData ? data : ""}
          <i className="fa fa-caret-up fa-fw"></i>
        </span>
      )
    }
  }

  return html
}

export default {
  transform
}
