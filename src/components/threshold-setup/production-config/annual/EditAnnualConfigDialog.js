import React, { useEffect, useState, useRef } from "react"
import { useSelector } from "react-redux"
import { CANCEL_REQUEST } from "../../../../constants/index"
import axios from "axios"
import { Button, Modal, Alert } from "rsuite"
import Confirm from "../../../shared/Confirm"
import ThresholdService from "../../../../services/threshold.service"
import AnnualConfigDialogContent from "./AnnualConfigDialogContent"

const EditAnnualConfigDialog = ({
  showDialog,
  submitConfig,
  cancelConfig,
  deleteConfig,
  data
}) => {
  const user = useSelector(state => state.authReducer.user)
  const [formRef, setFormRef] = useState(useRef(null))
  const [formValue, setFormValue] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  useEffect(() => {
    if (data) {
      setFormValue({
        type: data.type,
        year: data.year,
        workingDays: data.workingDays,
        annualTarget: data.annualTarget,
        bu: data.bu,
        kpiId: data.kpiId,
        createdBy: data.createdBy,
        updatedBy: user.username,
        isDefault: data.isDefault,
        millId: data.millId,
        annualConfigurationId: data.annualConfigurationId
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
    ThresholdService.editProductionTargetConfig(formValue, source).then(
      data1 => {
        if (data1 && data1.success) {
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
  const handleDelete = () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    const param = {
      type: data.type,
      year: data.year,
      workingDays: data.workingDays,
      annualTarget: data.annualTarget,
      bu: data.bu,
      kpiId: data.kpiId,
      createdBy: data.createdBy,
      updatedBy: user.username,
      isDefault: data.isDefault,
      millId: data.millId,
      annualConfigurationId: data.annualConfigurationId
    }
    ThresholdService.deleteAnnualConfig(param, source).then(
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
          <Modal.Title>Edit Annual Target</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AnnualConfigDialogContent
            setFormRef={setFormRef}
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

export default EditAnnualConfigDialog
