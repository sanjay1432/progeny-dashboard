import FilterPanel from "components/modal/sharedComponent/FilterPanel"
import Table from "components/modal/sharedComponent/Table"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import UserService from "../../../../services/user.service"
import { Modal, Button } from "rsuite"
import axios from "axios"

const AssignEstate = ({ show, hide, username }) => {
  const [estateList, setEstateList] = useState()
  const dispatch = useDispatch()
  const columns = [
    {
      name: "estate",
      dataKey: "estate",
      width: 200
    }
  ]

  useEffect(() => {
    UserService.getEstateList().then(response => {
      const data = response.data
      setEstateList(data)
    })
  }, [])

  return (
    <Modal show={show} onHide={hide}>
      <Modal.Header>
        <b>Assign Estate</b>
        <p>Assign Estate to {username}</p>
      </Modal.Header>
      <Modal.Body>
        {/* <FilterPanel />*/}
        {/* <p>List of Estates({data.length})</p> */}
        <Table columns={columns} data={estateList} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={hide}>Cancel</Button>
        <Button appearance="primary">Save Assignment</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AssignEstate
