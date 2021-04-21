import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants/index"
import LostcookService from "../../../services/lostcook.service"
import { Button, Modal, Alert, DatePicker } from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import moment from "moment"
import {
  setModifiedConfig,
  setSaveModifiedSummaryCookList
} from "redux/actions/lostcookSummaryToday.action"
import Confirm from "components/shared/Confirm"
import FiberlineSummaryEditor from "./FiberlineSummaryEditor"

const EditCookSummaryTodayDialog = ({
  isEditCookSummary,
  onSave,
  onCancel
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedDateTemp, setSelectedDateTemp] = useState(new Date())
  const [cookSummaryTodayConfigs, setSummaryTodayConfigs] = useState(null)

  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const dispatch = useDispatch()
  const isModifiedConfig = useSelector(
    state => state.lostcookSummaryTodayReducer.isModifiedConfig
  )

  const save = () => {
    onSave(selectedDate)
    setSelectedDate(new Date())
  }

  const cancel = () => {
    if (isModifiedConfig) {
      setShowConfirmDialog(true)
    } else {
      setSelectedDate(new Date())
      onCancel()
    }
  }

  const onYesConfirmDialog = () => {
    if (
      moment(selectedDateTemp).format("DD MMM YYYY") !==
      moment(selectedDate).format("DD MMM YYYY")
    ) {
      setSelectedDate(selectedDateTemp)
    } else {
      onCancel()
      setSelectedDate(new Date())
    }
    setShowConfirmDialog(false)
  }

  const onNoConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

  const onChangeDate = selected => {
    if (isModifiedConfig) {
      setShowConfirmDialog(true)
      setSelectedDateTemp(selected)
    } else {
      setSelectedDate(selected)
    }
  }

  const fetchData = useCallback(
    async source => {
      if (isEditCookSummary) {
        await LostcookService.getSummaryCookConfig(
          { selectedDate },
          source
        ).then(
          data => {
            setSummaryTodayConfigs(data.config)
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
    },
    [selectedDate, isEditCookSummary]
  )

  useEffect(() => {
    if (isEditCookSummary) {
      dispatch(setSaveModifiedSummaryCookList([]))
      dispatch(setModifiedConfig(false))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      fetchData(source)
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [isEditCookSummary, dispatch, fetchData])

  return (
    <>
      <Modal
        full
        overflow={true}
        show={isEditCookSummary}
        onHide={() => cancel()}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Edit Cook Summary Today</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Record Date: </span>
          <DatePicker
            style={{ width: 150 }}
            format="DD MMM YYYY"
            cleanable={false}
            value={selectedDate}
            onChange={selected => onChangeDate(selected)}
          />
          {cookSummaryTodayConfigs
            ? cookSummaryTodayConfigs.map((fiberlineData, index) => {
                return (
                  <FiberlineSummaryEditor
                    fiberlineData={fiberlineData}
                    key={index}
                  />
                )
              })
            : ""}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => cancel()} appearance="subtle">
            Cancel
          </Button>
          <Button onClick={() => save()} appearance="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal>
      <Confirm
        message="You will lost your changes, Are you sure you want to proceed?"
        isOpen={showConfirmDialog}
        onYes={() => onYesConfirmDialog()}
        onNo={() => onNoConfirmDialog()}
      />
    </>
  )
}

export default EditCookSummaryTodayDialog
