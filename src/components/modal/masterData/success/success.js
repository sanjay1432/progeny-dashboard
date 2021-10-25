import React from "react"
import { Modal, Button } from "rsuite"
import { useDispatch } from "react-redux"
import { setBreadcrumb } from "../../../../redux/actions/app.action"
import TrialService from "../../../../services/trial.service"
const SuccessModal = ({ show, hide, data, ...props }) => {
  const dispatch = useDispatch()
  async function attachProgeny() {
    const trial = await TrialService.getTrial(data.data.trialCode)
    console.log({ trial })
    dispatch(
      setBreadcrumb({
        breadcrumb: ["Plot", `Attach Progenies`],
        option: {
          trial: trial.trialCode,
          trialId: trial.trialId,
          estate: trial.estate,
          type: "attach"
        }
      })
    )
  }

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
    switch (data?.type && data.action) {
      case "TRIAL" && "CREATED":
        return (
          <Modal show={show} onHide={hide}>
            <Modal.Header>
              <Modal.Title style={{ color: "#009D57" }}>
                Trial Added : Attach Progeny
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ color: "#444444" }}>
              <UnderLinedText text={`Trial ${data.data.trialCode}`} /> and it’s{" "}
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
      case "TRIAL" && "UPDATED":
        return (
          <Modal show={show} onHide={hide}>
            <Modal.Header>
              <Modal.Title style={{ color: "#009D57" }}>
                Trial Edited : Attach Progeny
              </Modal.Title>
            </Modal.Header>
            <Modal.Body style={{ color: "#444444" }}>
              <UnderLinedText text={`Trial ${data.data.trialCode}`} /> and it’s{" "}
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
      case "TRIAL" && "REMOVE":
        return null
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
