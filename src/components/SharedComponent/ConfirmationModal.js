import React from "react"
import { Modal, Button } from "rsuite"

const ConfirmationModal = ({
  currentPage,
  show,
  hide,
  data,
  save,
  savePlotData,
  savePalmData
}) => {
  switch (currentPage) {
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
                <b className="targetName"> Trial {data.trialid}</b> from the
                list? This might change data that is associate with it as well.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                onClick={() => savePlotData(data.trialid)}
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
                <b className="targetName"> Palm {data.palmno}</b> for
                <b className="targetName"> {data.plot}</b> for
                <b className="targetName"> Replicate {data.replicate}</b> at
                <b className="targetName"> Trial {data.trialid}</b> from the
                list? This might change data that is associate with it as well.
              </p>
            </Modal.Body>

            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                onClick={() => savePalmData(data.trialid)}
                appearance="primary"
              >
                Yes
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )
    case "palmNumberEdit":
      return (
        <>
          <Modal id="confirmationModal" show={show} onHide={hide}>
            <Modal.Header>
              <b className="title">Edit Palm</b>
            </Modal.Header>
            <Modal.Body>
              <p>
                Are you sure edit Palm for
                <b className="targetName"> {data.plot}</b> for
                <b className="targetName"> Replicate {data.replicate}</b> at
                <b className="targetName"> Trial {data.trialid}</b> from the
                list? This might change data that is associate with it as well.
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button className="noButton" onClick={hide} appearance="subtle">
                No
              </Button>
              <Button
                className="yesButton"
                appearance="primary"
                onClick={() => save()}
              >
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
