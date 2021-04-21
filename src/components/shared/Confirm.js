import React from "react"
import { Button, Modal, Icon } from "rsuite"

const Confirm = ({ isOpen, message, onYes, onNo }) => {
  const yes = () => {
    onYes()
  }

  const no = () => {
    onNo()
  }

  return (
    <>
      <Modal backdrop="static" show={isOpen} size="xs">
        <Modal.Body>
          <Icon
            icon="remind"
            style={{
              color: "#ffb300",
              fontSize: 24
            }}
          />
          {"  "}
          {message || "Are you sure you want to proceed?"}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => no()} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={() => yes()} appearance="primary">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Confirm
