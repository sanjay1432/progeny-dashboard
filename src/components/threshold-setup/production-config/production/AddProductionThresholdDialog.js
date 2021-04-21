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
import ProductionThresholdDialogContent from "./ProductionThresholdDialogContent"

const initFormValue = {
  type: "",
  threshold: 0,
  maximum: 10000,
  startDate: null,
  endDate: null
}

const AddProductionThresholdDialog = ({
  showDialog,
  submitConfig,
  cancelConfig
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
    ThresholdService.addProductionTargetConfig(param, source).then(
      data => {
        if (data && data.success) {
          submitConfig()
          Alert.success("Successful added.", 2000)
        }
      },
      error => {
        if (error && error.message !== CANCEL_REQUEST) {
          Alert.error(
            error.message || "API error, please contact Dev team to check.",
            5000
          )
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
        size="lg"
        placement="right"
        show={showDialog}
        onHide={() => cancelConfig()}
      >
        <Modal.Header>
          <Modal.Title>Add Production Threshold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ProductionThresholdDialogContent
            setFormRef={setFormRef}
            formValue={formValue}
            setFormValue={setFormValue}
            configType={CONFIG_TYPE.production}
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

export default AddProductionThresholdDialog
