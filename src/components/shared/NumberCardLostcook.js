import React, { useEffect } from "react"
import { Popover, Whisper, Notification } from "rsuite"
import classnames from "classnames"

const NumberCardLostcook = ({
  title,
  subTitle,
  value,
  desc,
  estimateTarget,
  color,
  hasAdt,
  warning
}) => {
  return (
    <>
      <div className="number-card__lostcook">
        <div className="__header">
          <div className="__header-title">
            <h3>{title}</h3>
            <small className="__desc">{subTitle || <span>&#8203;</span>}</small>
          </div>
          {estimateTarget ? (
            <Whisper
              placement="top"
              trigger="hover"
              speaker={
                <Popover title={`Estimate Target = ${estimateTarget}`} />
              }
            >
              <div className="__additional">
                <i className="fa fa-crosshairs" />
                <span>{estimateTarget}</span>
              </div>
            </Whisper>
          ) : (
            ""
          )}
        </div>
        <h2
          className={classnames(
            "__value",
            {
              red: color === "red"
            },
            {
              green: color === "green"
            }
          )}
        >
          {value}
          {warning ? (
            <Whisper
              placement="top"
              trigger="hover"
              speaker={<Popover title={`${warning}`} />}
            >
              <i className="lc_warning fa fa-exclamation-triangle" />
            </Whisper>
          ) : (
            ""
          )}
        </h2>
        <span
          className={classnames("__desc", {
            "has-adt": hasAdt === true
          })}
        >
          {desc}
        </span>
      </div>
    </>
  )
}
NumberCardLostcook.defaultProps = {
  title: ""
}

export default NumberCardLostcook
