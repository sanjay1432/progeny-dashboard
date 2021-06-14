import FilterPanel from "components/modal/sharedComponent/FilterPanel"
import Table from "components/modal/sharedComponent/DataTable"
import React, { useState, useEffect } from "react"
import UserService from "../../../../services/user.service"
import { Modal, Button } from "rsuite"

const AssignEstate = ({
  show,
  hide,
  username,
  selectedItem,
  assignEstateToUser,
  ...props
}) => {
  const [estateList, setEstateList] = useState([])

  useEffect(() => {
    UserService.getEstateList().then(response => {
      const data = response.data
      setEstateList(data)
    })
  }, [])

  const columns = [
    {
      name: "estate",
      dataKey: "estate",
      width: 200
    }
  ]

  return (
    <Modal id="assignEstateModal" show={show} onHide={hide}>
      <Modal.Header>
        <b className="title">Assign Estate</b>
        <div className="description">
          <p>
            Assign Estate to <b>{username}</b>
          </p>
        </div>
      </Modal.Header>
      <Modal.Body>
        <FilterPanel labelName="Estate" data={estateList} dataType="estate" />
        <p className="total_item">List of Estates({estateList.length})</p>
        <Table
          columns={columns}
          data={estateList}
          selectedItem={selectedItem ? selectedItem : null}
          onChange={keys => props.setSelectedItem(keys)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={hide} appearance="subtle">
          Cancel
        </Button>
        <Button
          appearance="primary"
          appearance="primary"
          onClick={assignEstateToUser}
        >
          Save Assignment
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default AssignEstate
