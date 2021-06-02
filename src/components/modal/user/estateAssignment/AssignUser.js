import FilterPanel from "components/modal/sharedComponent/FilterPanel"
import Table from "components/modal/sharedComponent/Table"
import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import UserService from "../../../../services/user.service"
import axios from "axios"
import { Modal, Button } from "rsuite"

const AssignUser = ({ show, hide, estate }) => {
  const [userList, setUserList] = useState([])
  const [positionList, setPositionList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    UserService.getUserList().then(response => {
      const data = response.data
      setUserList(data)
    })

    UserService.getPositionList().then(response => {
      const data = response.data
      setPositionList(data)
    })
  }, [])

  const columns = [
    {
      name: "User ID",
      dataKey: "userId",
      width: 100
    },
    {
      name: "Username",
      dataKey: "username",
      width: 150
    },
    {
      name: "Position",
      dataKey: "position",
      width: 150
    }
  ]

  return (
    <Modal id="assignUserModal" show={show} onHide={hide}>
      <Modal.Header>
        <b className="title">Assign Estate</b>
        <p className="description">
          Assign Estate to <b>{estate}</b>
        </p>
      </Modal.Header>
      <Modal.Body>
        <FilterPanel
          labelName="Position"
          data={positionList}
          dataType="position"
        />
        <p className="total_item">List of Estates({userList.length})</p>
        <Table columns={columns} data={userList} />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={hide}>Cancel</Button>
        <Button appearance="primary">Save Assignment</Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AssignUser
