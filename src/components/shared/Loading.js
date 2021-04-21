import React from "react"

const Loading = ({ data }) => {
  return (
    <div className="loading-box">
      <div className="multi-ripple">
        <div></div>
        <div></div>
      </div>
      <p>Loading</p>
    </div>
  )
}

export default Loading
