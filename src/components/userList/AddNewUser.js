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
import { getPositionList } from "../../redux/actions/user.action"
import UserService from "../../services/user.service"
import { clearBreadcrumb } from "../../redux/actions/app.action"
import { publish } from "../../services/pubsub.service"

let selectionData = {}

const AddNewUser = () => {
  const initialForm = {
    userId: "",
    username: "",
    position: ""
  }
  const [formData, setFormData] = useState(initialForm)
  const dispatch = useDispatch()

  const PositionList = useSelector(state => state.positionListReducer.result)

  useEffect(() => {
    dispatch(getPositionList())
  }, [])

  const selectionType = [{ name: "position" }]

  if (PositionList) {
    selectionType.forEach(filter => {
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

  function handleChange(e) {
    e.persist()
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function addNewUser() {
    UserService.addNewUser(formData).then(
      data => {
        console.log(formData, "has been added to the system.")
        const savedData = {
          type: "USERLIST_ADD",
          data: formData,
          action: "CREATED"
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
    <div id="addNewUser">
      <Form className="formLayout">
        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">User ID</ControlLabel>
          <FormControl
            name="userId"
            className="dataBox"
            placeholder="User ID"
            onChange={(value, e) => handleChange(e)}
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Username</ControlLabel>
          <FormControl
            name="username"
            className="dataBox"
            placeholder="Username"
            onChange={(value, e) => handleChange(e)}
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Position</ControlLabel>
          <SelectPicker
            name="position"
            data={dataInSelection}
            onChange={value =>
              setFormData(() => ({ ...formData, ["position"]: value }))
            }
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
              onClick={addNewUser}
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
