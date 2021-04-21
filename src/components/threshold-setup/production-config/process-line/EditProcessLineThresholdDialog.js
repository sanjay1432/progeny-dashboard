import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST, CONFIG_TYPE } from "../../../../constants/index"
import axios from "axios"
import { Button, Modal, Alert } from "rsuite"
import Confirm from "../../../shared/Confirm"
import ThresholdService from "../../../../services/threshold.service"
import _ from "lodash"
import ProductionThresholdDialogContent from "../production/ProductionThresholdDialogContent"

const EditProcessLineThresholdDialog = ({
  showDialog,
  submitConfig,
  cancelConfig,
  deleteConfig,
  data,
  processLines
}) => {
  const user = useSelector(state => state.authReducer.user)
  const [formRef, setFormRef] = useState(useRef(null))
  const [formValue, setFormValue] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (data) {
      setFormValue({
        processLine: data.processLine.processLineCode,
        threshold: data.threshold,
        maximum: data.maximum,
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
  }, [showDialog, data, user])

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
      threshold: data.threshold,
      maximum: data.maximum,
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
        size="lg"
        placement="right"
        show={showDialog}
        onHide={() => cancelConfig()}
      >
        <Modal.Header>
          <Modal.Title>Edit Process Line Threshold</Modal.Title>
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

export default EditProcessLineThresholdDialog
