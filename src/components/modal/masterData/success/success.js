import { functions } from "lodash"
import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { Modal, Table, Button, Checkbox } from "rsuite"
const SuccessModal = ({ show, hide, data, ...props }) => {
  function attachProgeny() {}

  function UnderLinedText(props) {
    return (
      <span
        style={{
          fontWeight: "bold",
          textDecorationLine: "underline",
          fontSize: "16px"
        }}
      >
        {props.text}
      </span>
    )
  }
  function ShowModal() {
    switch (data?.type) {
      case "TRIAL":
        if (data.action === "CREATED") {
          return (
            <Modal show={show} onHide={hide}>
              <Modal.Header>
                <Modal.Title style={{ color: "#009D57" }}>
                  Trial Added : Attach Progeny
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ color: "#444444" }}>
                <UnderLinedText text={`Trial ${data.data.trialid}`} /> and it’s{" "}
                <UnderLinedText text={"Replicate"} /> has been added! <br />
                Would you like to attach the{" "}
                <UnderLinedText text={"Plots and Progenies"} /> for this Trial?
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
        }
        if (data.action === "UPDATED") {
          return (
            <Modal show={show} onHide={hide}>
              <Modal.Header>
                <Modal.Title style={{ color: "#009D57" }}>
                  Trial Edited : Attach Progeny
                </Modal.Title>
              </Modal.Header>
              <Modal.Body style={{ color: "#444444" }}>
                <UnderLinedText text={`Trial ${data.data.trialid}`} /> and it’s{" "}
                <UnderLinedText text={"Replicate"} /> has been edited! <br />
                Would you like to attach the{" "}
                <UnderLinedText text={"Plots and Progenies"} /> for this Trial?
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
        }

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
