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
import UserService from "../../../services/user.service"
import { getPositionList } from "../../../redux/actions/user.action"
import { setBreadcrumb } from "../../../redux/actions/app.action"
let selectionData = {}
const AddNewUser = () => {
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState(null)
  const [position, setPosition] = useState(null)
  const [message, setMessage] = useState(null)
  const dispatch = useDispatch()

  const positionList = useSelector(state => state.positionListReducer)
  const PositionList = positionList.result

  useEffect(() => {
    dispatch(getPositionList())
  }, [])

  function handleActionExpand(breadcrumb, option) {
    dispatch(setBreadcrumb({ breadcrumb, option }))
  }

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

  const popUpDescription = username + " has been added to the system."

  function PopUpMessage() {
    if (message === true) {
      return (
        <>
          <Message showIcon type="success" description={popUpDescription} />
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
              onClick={() => handleActionExpand()}
            >
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
