import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  SelectPicker,
  Button,
  ControlLabel,
  Form,
  FormGroup,
  FormControl,
  ButtonToolbar
} from "rsuite"
import { getPositionList } from "../../../redux/actions/user.action"
import { clearBreadcrumb } from "../../../redux/actions/app.action"

let selectionData = {}
const AddNewUser = ({ option, ...props }) => {
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [position, setPosition] = useState(null)
  const userForm = { userId: userId, username: username, position: position }
  const dispatch = useDispatch()

  const PositionList = useSelector(state => state.positionListReducer.result)

  useEffect(() => {
    dispatch(getPositionList())
  }, [])

  const selectionType = [{ name: "position" }]

  if (PositionList) {
    selectionType.forEach(filter => {
      console.log(filter)
      const selectionLabel = "position"
      const selectiondata = [
        ...new Set(PositionList.map(res => res[selectionLabel]))
      ]

      selectionData[selectionLabel] = selectiondata
    })
  }

  let dataInSelection = []

  const finalData = selectionData["position"]

  if (finalData) {
    finalData.forEach(data => {
      dataInSelection.push({
        label: data,
        value: data
      })
    })
  } else {
    dataInSelection.push({
      label: "not data",
      value: "not data"
    })
  }

  return (
    <div id="addNewUser">
      <Form className="formLayout">
        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">User ID</ControlLabel>
          <FormControl
            name="userId"
            value={userId}
            className="dataBox"
            placeholder="User ID"
            onChange={setUserId}
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Username</ControlLabel>
          <FormControl
            name="username"
            value={username}
            className="dataBox"
            placeholder="Username"
            onChange={setUsername}
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Position</ControlLabel>
          <SelectPicker
            name="position"
            value={position}
            data={dataInSelection}
            onChange={setPosition}
          />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button
              appearance="subtle"
              className="btnCancel"
              onClick={() => dispatch(clearBreadcrumb())}
            >
              Cancel
            </Button>

            <Button
              appearance="primary"
              className="btnSave"
              onClick={option.addNewUser}
            >
              Save
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  )
}

export default AddNewUser
