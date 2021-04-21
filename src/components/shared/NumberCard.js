import React from "react"
import classnames from "classnames"

const NumberCard = ({
  name,
  cation,
  value,
  refValue,
  refValueIndicator = "up"
}) => {
  const indicator = classnames({
    __up: refValueIndicator === "up",
    __down: refValueIndicator === "down"
  })
  return (
    <>
      <div className="number-card">
        <h2>{name}</h2>
        <small>{cation}</small>
        <div className="_center">
          <h1>{value}</h1>
          <h3 className={indicator}>
            <i className="fa fa-caret-up"></i> {refValue}
          </h3>
        </div>
      </div>
    </>
  )
}
NumberCard.defaultProps = {
  name: ""
}

export default NumberCard
