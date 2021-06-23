import FilterPanel from "components/modal/sharedComponent/FilterPanel"
import Table from "components/modal/sharedComponent/DataTable"
import React, { useState, useEffect } from "react"
import UserService from "../../../../services/user.service"
import { Modal, Button } from "rsuite"

const AssignUser = ({
  show,
  hide,
  estate,
  selectedItem,
  assignUserToEstate,
  ...props
}) => {
  const [userList, setUserList] = useState([])
  const [positionList, setPositionList] = useState([])

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
      flexGrow: 1
    }
  ]

  return (
    <>
      <Modal id="UserModal" show={show} onHide={hide}>
        <Modal.Header>
          <b className="title">Assign Estate</b>
          <div className="description">
            <p>
              Assign User to <b>{estate}</b>
            </p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <FilterPanel
            labelName="Position"
            data={positionList}
            dataType="position"
          />
          <p className="totalItem">List of Estates({userList.length})</p>
          <Table
            columns={columns}
            data={userList}
            selectedItem={selectedItem ? selectedItem : null}
            onChange={keys => props.setSelectedItem(keys)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button appearance="subtle" onClick={hide}>
            Cancel
          </Button>
          <Button appearance="primary" onClick={assignUserToEstate}>
            Save Assignment
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AssignUser
