import React from "react"
import { Modal, Button } from "rsuite"

const ConfirmationModal = ({
  action,
  show,
  hide,
  data,
  save,
  savePlotData,
  savePalmData
}) => {
  switch (action) {
    case "plot":
      return (
        <>
          <Modal id="confirmationModal" show={show} onHide={hide}>
            <Modal.Header>
              <b className="title">Edit Palm</b>
            </Modal.Header>

            <Modal.Body>
              <p>
                Are you sure to edit
                <b className="targetName"> {data.plot}</b> for
                <b className="targetName"> Replicate {data.replicate}</b> at
                <b className="targetName"> Trial {data.trialCode}</b> from the
                list? This might change data that is associate with it as well.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                onClick={() => savePlotData(data.plotId)}
                appearance="primary"
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )
    case "palm":
      return (
        <>
          <Modal id="confirmationModal" show={show} onHide={hide}>
            <Modal.Header>
              <b className="title">Edit Palm</b>
            </Modal.Header>

            <Modal.Body>
              <p>
                Are you sure edit
                <b className="targetName"> {data.palmno}</b> for
                <b className="targetName"> {data.plot}</b> for
                <b className="targetName"> Replicate {data.replicate}</b> at
                <b className="targetName"> Trial {data.trialCode}</b> from the
                list? This might change data that is associate with it as well.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                onClick={() => savePalmData(data.trialId)}
                appearance="primary"
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )
    case "MULTIPALMDATA_UPDATE":
      return (
        <>
          <Modal id="confirmationModal" show={show} onHide={hide}>
            <Modal.Header>
              <b className="title">Edit Palm Information</b>
            </Modal.Header>
            <Modal.Body>
              <p>
                All the Palms have been named and numbered. Are these informations alright?
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                appearance="primary"
                onClick={() => save("")}
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )

    case "PROGENY_CREATE":
      return (
        <>
          <Modal id="confirmationModal" show={show} onHide={hide}>
            <Modal.Header>
              <b className="title">Saving Progeny</b>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure want to savethis Progeny
                <b className="targetName"> {data.progenyId}</b>? This Progeny
                will be created inside the system.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button className="yesButton" appearance="primary" onClick={save}>
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )

    case "PROGENY_EDIT":
        return (
          <>
            <Modal id="confirmationModal" show={show} onHide={hide}>
              <Modal.Header>
                <b className="title">Edit Progeny</b>
              </Modal.Header>
              <Modal.Body>
                <p>
                  Are you sure want to edit  Progeny ID
                  <b className="targetName"> {data.progenyCode}</b>? This might 
                  change data that is associate with it as well!.
                </p>
              </Modal.Body>
              <Modal.Footer>
                <Button className="noButton" onClick={hide} appearance="subtle">
                  No
                </Button>
                <Button className="yesButton" appearance="primary" onClick={save}>
                  Yes
                </Button>
              </Modal.Footer>
            </Modal>
          </>
        )
    default:
      return null
  }
}

export default ConfirmationModal
