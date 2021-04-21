import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST } from "../../../../constants/index"
import axios from "axios"
import { Button, Modal, Alert } from "rsuite"
import Confirm from "../../../shared/Confirm"
import ThresholdService from "../../../../services/threshold.service"
import _ from "lodash"
import ConsumptionThresholdDialogContent from "./ConsumptionThresholdDialogContent"
const initFormValue = {
  processLine: "",
  threshold: 0,
  thresholdMax: null,
  kpiCategory: null,
  kpiId: null,
  startDate: null,
  endDate: null
}
const EditConsumptionThresholdDialog = ({
  showDialog,
  submitConfig,
  cancelConfig,
  deleteConfig,
  data,
  processLines,
  selectedCategory
}) => {
  const user = useSelector(state => state.authReducer.user)
  const [formRef, setFormRef] = useState(useRef(null))
  const [formValue, setFormValue] = useState(initFormValue)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (data) {
      setFormValue({
        processLine: data.processLine.processLineCode,
        threshold: data.threshold,
        thresholdMax: data.thresholdMax,
        kpiCategory: selectedCategory,
        startDate: new Date(data.startDate),
        endDate: new Date(data.endDate),
        bu: data.bu,
        kpiId: data.kpiId,
        createdBy: data.createdBy,
        updatedBy: user.username,
        isDefault: data.isDefault,
        millId: data.millId,
        processLineTargetThresholdId: data.processLineTargetThresholdId
      })
    }
  }, [showDialog, data, user, selectedCategory])

  const handleSubmit = () => {
    if (!formRef.check()) {
      Alert.error("Please check the error in the form.", 2000)
      return
    }
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const processLine = _.find(processLines, [
      "processLineCode",
      formValue.processLine
    ])

    ThresholdService.editProcessLineConfig(
      { ...formValue, processLine },
      source
    ).then(
      data1 => {
        if (data1 && data1.success) {
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
        console.log(error)
        return Promise.reject()
      }
    )
  }
  const handleDelete = () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const param = {
      processLine: data.processLine,
      threshold: data.thresholdMax
        ? `${data.threshold} - ${data.thresholdMax}`
        : data.threshold,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
      bu: data.bu,
      kpiId: data.kpiId,
      createdBy: data.createdBy,
      updatedBy: user.username,
      isDefault: data.isDefault,
      millId: data.millId,
      processLineTargetThresholdId: data.processLineTargetThresholdId
    }
    ThresholdService.deleteProcessLineConfig(param, source).then(
      data1 => {
        if (data1 && data1.success) {
          setShowConfirmDialog(false)
          deleteConfig()
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

  if (!formValue || !data) {
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
          <Modal.Title>Edit Consumption Threshold</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ConsumptionThresholdDialogContent
            setFormRef={setFormRef}
            processLines={processLines}
            formValue={formValue}
            setFormValue={setFormValue}
          />
        </Modal.Body>
        <Modal.Footer>
          <div className="d-flex justify-content-between">
            <Button onClick={() => setShowConfirmDialog(true)} color="red">
              Delete
            </Button>
            <div>
              <Button onClick={() => cancelConfig()} appearance="subtle">
                Cancel
              </Button>
              <Button onClick={() => handleSubmit()} appearance="primary">
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
      <Confirm
        message="Are you sure you want to delete?"
        isOpen={showConfirmDialog}
        onYes={() => handleDelete()}
        onNo={() => setShowConfirmDialog(false)}
      />
    </>
  )
}

export default EditConsumptionThresholdDialog
