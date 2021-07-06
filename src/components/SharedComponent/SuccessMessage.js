import React from "react"
import { Message } from "rsuite"

const SuccessMessage = ({ action, rowsToDelete, data, show, hide }) => {
  if (show === true) {
    switch (action) {
      case "PLOTDATA_UPDATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`${data.plot} for
                             Replicate ${data.replicate} for 
                             Trial ${data.trialCode} has been successfully edited.`}
              onClick={hide}
            />
          </>
        )

      case "PALMDATA_UPDATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Palm ${data.palmno} in 
                                 ${data.plot} in 
                                 Replicate ${data.replicate} in 
                                 Trial ${data.trialCode} has been successfully edited.`}
              onClick={hide}
            />
          </>
        )

      case "MULTIPALMDATA_UPDATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Palms have been successfully changed and saved in the system.`}
              onClick={hide}
            />
          </>
        )

      case "PROGENY_CREATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Progeny ${data.progenyId} has been successfuly been added.`}
              onClick={hide}
            />
          </>
        )

      case "PROGENY_UPDATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Progeny ${data.progenyId} has been successfuly been edited.`}
              onClick={hide}
            />
          </>
        )

      case "PROGENY_DELETE":
        return (
          <>
            {rowsToDelete.length < 2 ? (
              <Message
                showIcon
                type="success"
                description={`Progeny ${rowsToDelete[0].progenyId} has been successfuly been deleted.`}
                onClick={hide}
              />
            ) : (
              <Message
                showIcon
                type="success"
                description={`${rowsToDelete.length} Progenies  has been successfuly been deleted.`}
                onClick={hide}
              />
            )}
          </>
        )

      case "USER_CREATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`${data.username} has been added to the system.`}
              onClick={hide}
            />
          </>
        )

      case "USER_UPDATE":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`${data.username} has been edited to the system.`}
              onClick={hide}
            />
          </>
        )

      case "MULTIUSERTOESTATE_ASSIGN":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Users have been assigned to the estate.`}
              onClick={hide}
            />
          </>
        )

      case "MULTIESTATETOUSER_ASSIGN":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Estate have been assigned to the users.`}
              onClick={hide}
            />
          </>
        )
      case "":
      default:
        return null
    }
  } else {
    return null
  }
}

export default SuccessMessage
