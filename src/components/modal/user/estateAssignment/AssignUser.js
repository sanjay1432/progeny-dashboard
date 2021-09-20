import FilterPanel from "../../sharedComponent/FilterPanel"
import Table from "../../sharedComponent/DataTable"
import React, { useState, useEffect } from "react"
import EstateAssignmentService from "../../../../services/estateAssignment.service"
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
    EstateAssignmentService.getUserList().then(response => {
      const data = response.data
      setUserList(data)
    })

    EstateAssignmentService.getPositionList().then(response => {
      const data = response.data
      setPositionList(data)
    })
  }, [])

  const columns = [
    {
      name: "User ID",
      dataKey: "userId",
      flexGrow: 1
    },
    {
      name: "Username",
      dataKey: "username",
      flexGrow: 2
    },
    {
      name: "Position",
      dataKey: "position",
      flexGrow: 2
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
            modalType="AssignUser"
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
