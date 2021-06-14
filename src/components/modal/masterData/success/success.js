import { functions } from "lodash"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Modal, Table, Button, Checkbox } from "rsuite"
const SuccessModal = ({ show, hide, data, ...props }) => {
  function attachProgeny() {}
  function ShowModal() {
    switch (data?.type) {
      case "TRIAL":
        return (
          <Modal show={show} onHide={hide}>
            <Modal.Header>
              <Modal.Title style={{ color: "#009D57" }}>
                Trial Added : Attach Progeny
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ color: "#444444" }}>
              <span
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  fontSize: "16px"
                }}
              >
                Trial {data.data.trialid}
              </span>{" "}
              and it’s{" "}
              <span
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  fontSize: "16px"
                }}
              >
                Replicate
              </span>{" "}
              has been added! <br />
              Would you like to attach the{" "}
              <span
                style={{
                  fontWeight: "bold",
                  textDecorationLine: "underline",
                  fontSize: "16px"
                }}
              >
                {" "}
                Plots and Progenies
              </span>{" "}
              for this Trial?
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={hide} appearance="subtle">
                Attach Later
              </Button>
              <Button onClick={attachProgeny} appearance="primary">
                Attach Progeny
              </Button>
            </Modal.Footer>
          </Modal>
        )
      default:
        return <></>
    }
  }

  return (
    <div className="modal-container">
      <ShowModal />
    </div>
  )
}

export default SuccessModal
