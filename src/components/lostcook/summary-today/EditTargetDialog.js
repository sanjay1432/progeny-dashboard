import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants/index"
import GeneralHelper from "../../../helper/general.helper"
import LostcookService from "../../../services/lostcook.service"
import FiberlineEditor from "./FiberlineEditor"
import { Button, Modal, InputPicker, Alert } from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import {
  setSaveNewProductList,
  setModifiedConfig,
  setSaveModifiedProductList
} from "redux/actions/lostcookSummaryToday.action"
import Confirm from "components/shared/Confirm"
const years = GeneralHelper.generateArrayOfYears()

const EditTargetDialog = ({ isEditTarget, onSave, onCancel }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [selectedYearTemp, setSelectedYearTemp] = useState(
    new Date().getFullYear()
  )
  const [targetCookAndProductList, setTargetCookAndProductList] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const dispatch = useDispatch()
  const isModifiedConfig = useSelector(
    state => state.lostcookSummaryTodayReducer.isModifiedConfig
  )

  const save = () => {
    onSave(selectedYear)
    setSelectedYear(new Date().getFullYear())
  }

  const cancel = () => {
    if (isModifiedConfig) {
      setShowConfirmDialog(true)
    } else {
      setSelectedYear(years[0].value)
      onCancel()
    }
  }

  const onYesConfirmDialog = () => {
    if (selectedYearTemp !== selectedYear) {
      setSelectedYear(selectedYearTemp)
    } else {
      onCancel()
      setSelectedYear(years[0].value)
    }
    setShowConfirmDialog(false)
  }

  const onNoConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

  const onChangeYear = selected => {
    if (isModifiedConfig) {
      setShowConfirmDialog(true)
      setSelectedYearTemp(selected)
    } else {
      setSelectedYear(selected)
    }
  }

  const fetchData = useCallback(
    async source => {
      if (isEditTarget) {
        await LostcookService.getTargetCookAndProductConfig(
          { selectedYear },
          source
        ).then(
          data => {
            setTargetCookAndProductList(data.config)
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
    [selectedYear, isEditTarget]
  )

  useEffect(() => {
    if (isEditTarget) {
      dispatch(setSaveNewProductList([]))
      dispatch(setSaveModifiedProductList([]))
      dispatch(setModifiedConfig(false))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      fetchData(source)
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [fetchData, dispatch, isEditTarget])

  return (
    <>
      <Modal
        full
        overflow={true}
        show={isEditTarget}
        onHide={() => cancel()}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Edit Target Cook & Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <span>Year: </span>
          <InputPicker
            onChange={selected => onChangeYear(selected)}
            value={selectedYear}
            className="mr-3"
            data={years}
            cleanable={false}
            style={{ width: 150 }}
          />
          {targetCookAndProductList
            ? targetCookAndProductList.map((fiberlineData, index) => {
                return (
                  <FiberlineEditor
                    fiberlineData={fiberlineData}
                    key={index}
                    defaultOpen={false}
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

export default EditTargetDialog
