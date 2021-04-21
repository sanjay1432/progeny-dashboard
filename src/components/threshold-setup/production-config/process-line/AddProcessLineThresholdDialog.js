import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import {
  BUSINESS_UNIT_LIST,
  CANCEL_REQUEST,
  CONFIG_TYPE
} from "../../../../constants/index"
import axios from "axios"
import { Button, Modal, Alert } from "rsuite"
import _ from "lodash"
import ThresholdService from "../../../../services/threshold.service"
import ProductionThresholdDialogContent from "../production/ProductionThresholdDialogContent"

const initFormValue = {
  processLine: "",
  threshold: 0,
  maximum: 10000,
  startDate: null,
  endDate: null
}

const AddProcessLineThresholdDialog = ({
  showDialog,
  submitConfig,
  cancelConfig,
  processLines
}) => {
  const mill = useSelector(state => state.appReducer.mill)
  const user = useSelector(state => state.authReducer.user)
  const [formRef, setFormRef] = useState(useRef(null))
  const [formValue, setFormValue] = useState(initFormValue)

  useEffect(() => {
    setFormValue(initFormValue)
  }, [showDialog])

  const handleSubmit = () => {
    if (!formRef.check()) {
      Alert.error("Please check the error in the form.", 2000)
      return
    }
    const bu = _.find(BUSINESS_UNIT_LIST, ["buId", mill.buId])
    const processLine = _.find(processLines, [
      "processLineCode",
      formValue.processLine
    ])
    const param = {
      ...formValue,
      bu,
      kpiId: 1,
      createdBy: user.username,
      updatedBy: user.username,
      isDefault: null,
      millId: mill.millId,
      processLine
    }
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    ThresholdService.addProcessLineConfig(param, source).then(
      data => {
        if (data && data.success) {
          submitConfig()
          Alert.success("Successful.", 2000)
        }
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error(
            error.message || "API error, please contact Dev team to check.",
            5000
          )
        }
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
        size="lg"
        placement="right"
        show={showDialog}
        onHide={() => cancelConfig()}
      >
        <Modal.Header>
          <Modal.Title>Add Process Line Threshold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductionThresholdDialogContent
            processLines={processLines}
            setFormRef={setFormRef}
            formValue={formValue}
            setFormValue={setFormValue}
            configType={CONFIG_TYPE.processLine}
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

export default AddProcessLineThresholdDialog
