import React, { useState, useEffect } from "react"
import { useDispatch } from "react-redux"
import { Button, Grid, Row, Col, Input } from "rsuite"
import DataPicker from "../SharedComponent/DataPicker"
import UserListService from "../../services/userlist.service"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { publish } from "../../services/pubsub.service"

const EditUser = ({ option }) => {
  console.log(option)
  const initialForm = {
    userId: option.userId,
    username: option.username,
    position: option.position,
    status: option.status
  }
  const [formData, setFormData] = useState(initialForm)
  const [positionList, setPositionList] = useState([])
  const dispatch = useDispatch()

  useEffect(() => {
    UserListService.getPositionList().then(response => {
      setPositionList(response.data)
    })
  }, [])

  const statusList = [
    {
      status: "active"
    },
    {
      status: "inactive"
    }
  ]

  function handleChange(e) {
    e.persist()
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function updateUser() {
    UserListService.updateUser(formData).then(
      data => {
        console.log(formData, "has not been edited to the system.")
        dispatch(clearBreadcrumb())
        const savedData = {
          type: "USERLIST_UPDATE",
          data: formData,
          action: "UPDATE"
        }
        dispatch(clearBreadcrumb())
        publish(savedData)
      },
      error => {
        console.log(error.message)
      }
    )
  }

  return (
    <div id="UserListAction">
      <Grid fluid>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">User ID</p>
          </Col>
          <Col>
            <Input
              name="userId"
              value={formData.userId}
              className="dataBox"
              placeholder="User ID"
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>

        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Username</p>
          </Col>
          <Col>
            <Input
              name="username"
              value={formData.username}
              className="dataBox"
              placeholder="Username"
              onChange={(value, e) => handleChange(e)}
            />
          </Col>
        </Row>

        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Position</p>
          </Col>
          <Col>
            <DataPicker
              dataType="position"
              dataValue={formData.position}
              OriginalData={positionList}
              onChange={value =>
                setFormData(() => ({ ...formData, position: value }))
              }
            />
          </Col>
        </Row>

        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Status</p>
          </Col>
          <Col>
            <DataPicker
              dataType="status"
              dataValue={formData.status}
              OriginalData={statusList}
              onChange={value =>
                setFormData(() => ({ ...formData, status: value }))
              }
            />
          </Col>
        </Row>

        <Row>
          <Col md={4} mdOffset={16} lg={4} lgOffset={16}>
            <Button
              appearance="subtle"
              className="cancelButton"
              onClick={() => dispatch(clearBreadcrumb())}
            >
              Cancel
            </Button>
          </Col>
          <Col md={4} lg={4}>
            <Button
              appearance="primary"
              className="saveButton"
              onClick={updateUser}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Grid>
    </div>
  )
}

export default EditUser
