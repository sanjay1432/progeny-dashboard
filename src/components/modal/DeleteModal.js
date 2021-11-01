import { Modal, Button } from "rsuite"

const DeleteModal = ({
  show,
  hide,
  activeNav,
  deleteRecord,
  rows,
  ...props
}) => {
  function Message() {
    switch (activeNav) {
      case "estate":
        return (
          <>
            {rows.length < 2 ? (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {activeNav} {rows[0].estate}
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            ) : (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {" "}
                  {rows.length} {activeNav}
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            )}
          </>
        )

      case "trial":
        return (
          <>
            {rows.length < 2 ? (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {activeNav} {rows[0].trialid}
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            ) : (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {" "}
                  {rows.length} {activeNav}s
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            )}
          </>
        )
      case "plot":
        return (
          <>
            {rows.length < 2 ? (
              <p style={{ color: "#444444" }}>
                Are you sure you want to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>{rows[0].plot}</b>{" "}
                in &nbsp;
                <b style={{ "text-transform": "capitalize" }}>
                  replicate {rows[0].replicate}
                </b>{" "}
                at &nbsp;
                <b style={{ "text-transform": "capitalize" }}>
                  trial {rows[0].trialid}
                </b>{" "}
                &nbsp; from the list? This might change data that is associate
                with it as well!
              </p>
            ) : (
              <p style={{ color: "#444444" }}>
                Are you sure you want to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {rows.length} plots
                </b>{" "}
                in their&nbsp;
                <b style={{ "text-transform": "capitalize" }}>replicates</b> at
                the &nbsp;
                <b style={{ "text-transform": "capitalize" }}>trial</b> &nbsp;
                from the list? This might change data that is associate with it
                as well!
              </p>
            )}
          </>
        )
      case "progeny":
        return (
          <>
            {rows.length < 2 ? (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {activeNav} {rows[0].progenyId}
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            ) : (
              <p style={{ color: "#444444" }}>
                Are you sure to delete{" "}
                <b style={{ "text-transform": "capitalize" }}>
                  {" "}
                  {rows.length} Progenies
                </b>{" "}
                from the list? This might change data that is associate with it
                as well!
              </p>
            )}
          </>
        )
      default:
        return <></>
    }
  }

  return (
    <>
      <Modal id="confirmationModal" backdrop show={show} onHide={hide} style={{ marginTop: "100px" }}>
        <Modal.Header>
          <Modal.Title style={{ "text-transform": "capitalize", color: "red" }}>
            Delete {activeNav}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Message />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide} appearance="subtle" className="noButton">
            No
          </Button>
          <Button onClick={deleteRecord} appearance="primary" className="yesButton">
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default DeleteModal
