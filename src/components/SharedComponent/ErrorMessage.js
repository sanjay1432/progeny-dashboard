import React from 'react'
import {Message} from 'rsuite';

const ErrorMessage = ({ description, show, hide }) => {
  if (show) {
    setTimeout(() => hide(), 5000)
  }
  
  return (
    <>
      {show ? (
        <Message
          showIcon
          type="error"
          description={description}
          onClick={hide}
        />
      ) : (
        null
      )}
    </>
  )
}

export default ErrorMessage
