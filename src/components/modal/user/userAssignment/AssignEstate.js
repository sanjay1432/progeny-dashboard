import FilterPanel from "components/modal/sharedComponent/FilterPanel"
import Table from "components/modal/sharedComponent/Table"
import React, { useState, useEffect } from "react"
import { Modal, Button } from "rsuite"

const AssignEstate = ({ show, hide }) => {
  const columns = [
    {
      name: "estate",
      datakey: "estate",
      flexgrow: 2
    }
  ]

  return (
    <Modal show={show} hide={hide}>
      <Modal.Header>
        <b>Assign Estate</b>
        <p>Assign Estate to Ali</p>
      </Modal.Header>
      <Modal.Body>
        {/* <FilterPanel />*/}
        <Table columns={columns} />
      </Modal.Body>
      <Modal.Footer>
        <Button>Cancel</Button>
        <Button appearance="primary">Save Assignment</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AssignEstate
