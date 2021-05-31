import React, { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import {
  getPosition,
  getPositionSuccess,
  addNewUser
} from "../../../redux/actions/user.action"
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

let selectionData = {}
const EditUser = ({ option }) => {
  const [data, setData] = useState()
  const [message, setMessage] = useState(null)
  const [userForm, setUserForm] = useState()

  //const Position = useSelector(state => state.positionReducer)
  //console.log("position", Position)

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios(
        "http://localhost:8000/api/v1/general/master-data/user-position"
      )

      setData(result.data.data)
    }

    fetchData()
  }, [])

  const selectionType = [{ name: "position" }]

  if (data) {
    selectionType.forEach(filter => {
      const selectionLabel = "position"
      const selectiondata = [...new Set(data.map(res => res[selectionLabel]))]
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

  function editUser() {
    const payload = {
      data
    }
  }

  function hello() {
    console.log(userForm)
  }

  return (
    <div id="addNewUser">
      <PopUpMessage />

      <Form className="formLayout">
        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">User ID</ControlLabel>
          <FormControl
            id="userId"
            value={option.userId}
            onChange={(value, e) => handleChange(e, value)}
            className="dataBox"
            name="userId"
            placeholder="User ID"
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Username</ControlLabel>
          <FormControl
            id="username"
            value={option.username}
            onChange={(value, e) => handleChange(e, value)}
            className="dataBox"
            name="username"
            placeholder="Username"
          />
        </FormGroup>

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Position</ControlLabel>
          <SelectPicker
            id="position"
            value={option.username}
            name="position"
            onChange={(value, e) => handleChange(e, value)}
            data={dataInSelection}
          />
        </FormGroup>

        <FormGroup>
          <ButtonToolbar>
            <Button appearance="subtle" className="btnCancel" onClick={hello}>
              Cancel
            </Button>
            <Button appearance="primary" className="btnSave" onClick={editUser}>
              Save
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  )
}

export default EditUser
