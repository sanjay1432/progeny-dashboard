import React from "react"
import { Modal, Button, Table, Checkbox } from "rsuite"
import SearchFilter from "./SearchFilter"

const AddEstateModal = ({ OpenModal, CloseModal }) => {
  return (
    <Modal id="addEstate" size="sm" show={OpenModal}>
      <Modal.Header>
        <Modal.Title>
          <div>
            <b className="title">Add Estate</b>
            <p className="description">Pulling Data From External System</p>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body></Modal.Body>
      <Modal.Footer>
        <Button className="btnCancel" appearance="ghost" onClick={CloseModal}>
          Cancel
        </Button>
        <Button className="btnAdd" appearance="primary">
          Add Estate
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AddEstateModal
