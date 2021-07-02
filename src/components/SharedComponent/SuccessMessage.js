import React from "react"
import { Message } from "rsuite"

const SuccessMessage = ({ currentPage, data }) => {
  switch (currentPage) {
    case "palmNumberEdit":
      return (
        <>
          <Message
            showIcon
            type="success"
            description={`${data.username} has been added to the system.`}
            onClick={() => {
              setSuccessMessage("")
            }}
          />
        </>
      )
    default:
      return null
  }
}

export default SuccessMessage
