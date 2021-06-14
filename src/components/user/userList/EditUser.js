import React, { useState, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { getPositionList } from "../../../redux/actions/user.action"
import {
  setBreadcrumb,
  clearBreadcrumb
} from "../../../redux/actions/app.action"
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

let selectionData = {}
const EditUser = ({ option }) => {
  console.log(option)
  const [userId, setUserId] = useState(option.userId)
  const [username, setUsername] = useState(option.username)
  const [position, setPosition] = useState(option.position)
  const [status, setStatus] = useState(option.status)
  const dispatch = useDispatch()
  const positionList = useSelector(state => state.positionListReducer)
  const PositionList = positionList.result

  useEffect(() => {
    dispatch(getPositionList())
  }, [])

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

  const statusData = [
    {
      label: "Active",
      value: "active"
    },
    {
      label: "Inactive",
      value: "inactive"
    }
  ]

  console.log(dataInSelection)
  console.log(statusData)

  // function PopUpMessage() {
  //   if (message === true) {
  //     return (
  //       <>
  //         <Message showIcon type="success" description={popUpDescription} />
  //       </>
  //     )
  //   } else if (message === false) {
  //     return (
  //       <>
  //         <Message showIcon type="error" description="System error" />
  //       </>
  //     )
  //   } else {
  //     return <></>
  //   }
  // }

  const popUpDescription = username + " has been edited to the system."

  return (
    <div id="addNewUser">
      {/* <PopUpMessage /> */}

      <Form className="formLayout">
        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">User ID</ControlLabel>
          <FormControl
            name="userId"
            value={userId}
            className="dataBox"
            placeholder="User ID"
            onChange={popUpDescription}
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

        <FormGroup className="labelLayout">
          <ControlLabel className="formLabel">Position</ControlLabel>
          <SelectPicker
            name="status"
            value={status}
            data={statusData}
            onChange={setStatus}
            searchable={false}
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
            <Button
              appearance="primary"
              className="btnSave"
              onClick={option.editCurrentUser}
            >
              Save
            </Button>
          </ButtonToolbar>
        </FormGroup>
      </Form>
    </div>
  )
}

export default EditUser
