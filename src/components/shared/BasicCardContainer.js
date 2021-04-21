import React from "react"

const BasicCardContainer = ({ children, bg }) => {
  return (
    <>
      <div className={`opex_card basic ${bg}`}>{children}</div>
    </>
  )
}
BasicCardContainer.defaultProps = {
  bg: "light"
}

export default BasicCardContainer
