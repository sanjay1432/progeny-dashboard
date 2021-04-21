import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { BUSINESS_UNIT_LIST, CANCEL_REQUEST } from "../../../../constants/index"
import axios from "axios"
import { Button, Modal, Alert } from "rsuite"
import _ from "lodash"
import ThresholdService from "../../../../services/threshold.service"
import AnnualConfigDialogContent from "./AnnualConfigDialogContent"
const initFormValue = {
  type: "",
  year: null,
  workingDays: null,
  annualTarget: null
}

const AddAnnualConfigDialog = ({ showDialog, submitConfig, cancelConfig }) => {
  const mill = useSelector(state => state.appReducer.mill)
  const user = useSelector(state => state.authReducer.user)
  const [formValue, setFormValue] = useState(initFormValue)
  const [formRef, setFormRef] = useState(useRef(null))

  useEffect(() => {
    setFormValue(initFormValue)
  }, [showDialog])

  const handleSubmit = () => {
    if (!formRef.check()) {
      Alert.error("Please check the error in the form.", 2000)
      return
    }
    const bu = _.find(BUSINESS_UNIT_LIST, ["buId", mill.buId])
    const param = {
      ...formValue,
      bu,
      kpiId: 1,
      createdBy: user.username,
      updatedBy: user.username,
      isDefault: null,
      millId: mill.millId
    }
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    ThresholdService.addAnnualConfig(param, source).then(
      data => {
        if (data && data.success) {
          submitConfig()
          Alert.success("Successful.", 2000)
        }
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error("We got an unknown error.", 5000)
        }
        console.log(error)
        return Promise.reject()
      }
    )
  }

  if (!mill) {
    return ""
  }

  return (
    <>
      <Modal
        size="sm"
        placement="right"
        show={showDialog}
        onHide={() => cancelConfig()}
      >
        <Modal.Header>
          <Modal.Title>Add Annual Target</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AnnualConfigDialogContent
            setFormRef={setFormRef}
            formValue={formValue}
            setFormValue={setFormValue}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => cancelConfig()} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={() => handleSubmit()} appearance="primary">
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default AddAnnualConfigDialog
