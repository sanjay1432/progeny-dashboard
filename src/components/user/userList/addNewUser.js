import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {
  SelectPicker,
  Button,
  ControlLabel,
  Message,
  Form,
  FormGroup,
  FormControl,
  ButtonToolbar
} from "rsuite"
import axios from "axios"
import UserService from "../../../services/user.service"
import { getPositionList } from "../../../redux/actions/user.action"
let selectionData = {}
const intializeUserForm = { userId: "", username: "", position: "" }
const AddNewUser = () => {
  const [value, setValue] = useState()
  const [userId, setUserId] = useState("")
  const [username, setUsername] = useState("")
  const [position, setPosition] = useState("position")
  const [message, setMessage] = useState(null)
  const [userForm, setUserForm] = useState(intializeUserForm)
  const dispatch = useDispatch()

  const positionList = useSelector(state => state.positionListReducer)
  const PositionList = positionList.result

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

  const handleChange = (e, value) => {
    e.persist()
    setUserForm(() => ({ ...userForm, [e.target.name]: value }))
    console.log(userForm)
  }

  function PopUpMessage() {
    if (message === true) {
      return (
        <>
          <Message
            showIcon
            type="success"
            description="has been added to the system"
          />
        </>
      )
    } else if (message === false) {
      return (
        <>
          <Message showIcon type="error" description="System error" />
        </>
      )
    } else {
      return <></>
    }
  }

  function addUser() {
    const payload = {
      userId: userId,
      username: username,
      position: position
    }
    console.log(payload)
    UserService.addNewUser(payload).then(
      data => {
        setMessage(true)
      },
      error => {
        setMessage(false)
      }
    )
  }

  return (
    <div id="addNewUser">
      <PopUpMessage />

      <Form className="formLayout">
        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">User ID</ControlLabel>
          <FormControl
            //id="userId"
            onChange={(value, e) => handleChange(e, value)}
            //value={userId}
            className="dataBox"
            name="userId"
            placeholder="User ID"
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Username</ControlLabel>
          <FormControl
            //id="username"
            onChange={(value, e) => handleChange(e, value)}
            //value={username}
            className="dataBox"
            name="username"
            placeholder="Username"
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Position</ControlLabel>
          <SelectPicker
            //id="position"
            name="position"
            onChange={(e, value) => handleChange(value)}
            data={dataInSelection}
          />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button appearance="subtle" className="btnCancel">
              Cancel
            </Button>
            <Button appearance="primary" className="btnSave" onClick={addUser}>
              Save
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  )
}

export default AddNewUser
