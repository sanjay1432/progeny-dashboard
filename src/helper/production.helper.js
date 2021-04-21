import React from "react"

const buildProcessLine = (data, index) => {
  return (
    <div key={index} index={`${data.processLineCode}`} className="__item">
      <span
        className="__box"
        style={{ backgroundColor: data.legendColor }}
      ></span>
      <span>{data.processLineCode}</span>
    </div>
  )
}

const buildMill = (data, index) => {
  return (
    <div key={index} index={`${data.millCode}`} className="__item">
      <span
        className="__box"
        style={{ backgroundColor: data.legendColor }}
      ></span>
      <span>{data.millName}</span>
    </div>
  )
}

export default {
  buildProcessLine,
  buildMill
}
