import React, { useEffect, useState, useCallback } from "react"
import axios from "axios"
import { CANCEL_REQUEST } from "../../../constants/index"
import LostcookService from "../../../services/lostcook.service"
import {
  Button,
  Modal,
  Alert,
  DatePicker,
  InputPicker,
  Input,
  CheckPicker,
  TagPicker,
  SelectPicker,
  InputNumber,
  Loader
} from "rsuite"
import { useDispatch, useSelector } from "react-redux"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { CardBody, Card } from "reactstrap"
import {
  setModifiedConfig,
  setSaveModifiedSummaryCookList
} from "redux/actions/lostcookSummaryToday.action"
import Confirm from "components/shared/Confirm"
import GeneralHelper from "../../../helper/general.helper"

const AddNewLostcookItemDialog = ({ isAddNewLostcook, onSave, onCancel }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [fiberLineList, setFiberlineList] = useState(null)
  const [areaList, setAreaList] = useState(null)
  const [responsibilityList, setResponsibilityList] = useState(null)
  const [problemList, setProblemList] = useState(null)
  const [equipmentList, setEquipmentList] = useState(null)
  const [internalExternalList, setInternalExternalList] = useState(null)
  const [responsibility, setResponsibility] = useState(1)
  const [fiberLine, setFiberline] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [numberOfLoss, setNumberOfLoss] = useState(0)
  const [area, setArea] = useState(1)
  const [internalAndExternal, setInternalAndExternal] = useState(1)
  const [equipment, setEquipment] = useState([])
  const [problem, setProblem] = useState("")
  const [explanation, setExplanation] = useState("")
  const [rootCause, setRootCause] = useState("")
  const [action, setAction] = useState("")
  const [nextAction, setNextAction] = useState("")
  const [pic, setPIC] = useState("")
  const [dueDate, setDueDate] = useState(new Date())
  const [remarks, setRemarks] = useState("")
  const [sapNotificationNo, setSapNotificationNo] = useState([])
  const dispatch = useDispatch()
  const user = useSelector(state => state.authReducer.user)
  const mill = useSelector(state => state.appReducer.mill)
  const [lostLimit, setLostLimit] = useState({
    min: 0,
    max: 0,
    message: "Please select Fiberline first."
  })
  const [canEditLost, setCanEditLost] = useState(false)
  const [statusList, setStatusList] = useState([])
  const [shiftList, setShiftList] = useState([])
  const [shift, setShift] = useState(null)
  const [status, setStatus] = useState(null)
  const [sapStatusList, setSapStatusList] = useState([])
  const [sapStatus, setSapStatus] = useState(null)
  const isModifiedConfig = useSelector(
    state => state.lostcookSummaryTodayReducer.isModifiedConfig
  )

  const save = () => {
    let check = canEditLost ? numberOfLoss : true
    if (
      fiberLine &&
      startDate &&
      check &&
      area &&
      responsibility &&
      internalAndExternal &&
      equipment.length > 0 &&
      problem &&
      status &&
      shift &&
      explanation
    ) {
      onSave({
        createdBy: user.username,
        fiberLine,
        startDate,
        numberOfLoss,
        status,
        shift,
        area,
        responsibility,
        internalAndExternal,
        equipment,
        problem,
        explanation,
        rootCause,
        action,
        nextAction,
        pic,
        dueDate,
        remarks,
        sapNotificationNo
      })
    } else {
      Alert.error("Please input all the required fields.", 5000)
    }
  }

  const cancel = () => {
    if (isModifiedConfig) {
      setShowConfirmDialog(true)
    } else {
      onCancel()
    }
  }

  const onYesConfirmDialog = () => {
    onCancel()
    setShowConfirmDialog(false)
  }

  const onNoConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

  const fetchData = useCallback(
    async source => {
      if (isAddNewLostcook) {
        setFiberline(null)
        setStartDate(new Date())
        setNumberOfLoss(0)
        setExplanation("")
        setRootCause("")
        setAction("")
        setNextAction("")
        setPIC("")
        setDueDate(new Date())
        setRemarks("")
        setArea(1)
        setResponsibility(1)
        setInternalAndExternal(1)
        setEquipment([])
        setProblem("")
        setLostLimit({
          min: 0,
          max: 0,
          message: "Please select Fiberline first."
        })
        setCanEditLost(false)
        setShift(null)
        setStatus(null)
        setSapStatus(null)
        await LostcookService.fiberlineList(
          { millId: mill.millId },
          source
        ).then(
          data => {
            setFiberlineList(data.filter(item => item.value !== "all"))
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        await LostcookService.areaList(source).then(
          data => {
            setAreaList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        await LostcookService.responsibilityList(source).then(
          data => {
            setResponsibilityList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        await LostcookService.problemList(source).then(
          data => {
            setProblemList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        await LostcookService.equipmentList(source).then(
          data => {
            setEquipmentList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )

        LostcookService.externalAndInternal(source).then(
          data => {
            setInternalExternalList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )

        LostcookService.shiftList(source).then(
          data => {
            setShiftList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )

        LostcookService.statusList(source).then(
          data => {
            setStatusList(data)
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
        LostcookService.sapStatus(source).then(
          data => {
            setSapStatusList(data)
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
    [isAddNewLostcook, mill.millId]
  )

  useEffect(() => {
    if (isAddNewLostcook) {
      dispatch(setSaveModifiedSummaryCookList([]))
      dispatch(setModifiedConfig(false))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      fetchData(source)
      return () => {
        source.cancel(CANCEL_REQUEST)
      }
    }
  }, [isAddNewLostcook, dispatch, fetchData])

  useEffect(() => {
    if (isAddNewLostcook && fiberLine) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.getLossLimit(
        { startDate, fiberLine, lc_id: null },
        source
      ).then(
        limit => {
          setLostLimit({
            min: limit.min,
            max: limit.max,
            message: limit.message
          })
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
  }, [isAddNewLostcook, startDate, fiberLine])

  return (
    <>
      <Modal
        full
        overflow={true}
        show={isAddNewLostcook}
        onHide={() => cancel()}
        backdrop="static"
      >
        <Modal.Header>
          <Modal.Title>Add New Lostcook Incident</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {startDate &&
          responsibilityList &&
          areaList &&
          internalExternalList &&
          shiftList &&
          statusList &&
          equipmentList &&
          problemList ? (
            <FilterCollapsible header="Lostcook Item Description">
              <Card>
                <CardBody>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Fiberline<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {fiberLineList && (
                        <InputPicker
                          block
                          onSelect={(value, item, event) => {
                            setCanEditLost(item.editable)
                            setFiberline(value)
                            dispatch(setModifiedConfig(true))
                          }}
                          value={fiberLine}
                          defaultValue={fiberLineList[0].value}
                          data={fiberLineList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Start Date<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      <DatePicker
                        block
                        oneTap
                        format="DD MMM YYYY"
                        cleanable={false}
                        value={startDate}
                        onChange={selected => setStartDate(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Number of Loss
                      {canEditLost && <span className="text-red">*</span>}
                    </div>
                    <div className="__new-col md">
                      <InputNumber
                        max={lostLimit.max}
                        min={lostLimit.min}
                        disabled={!canEditLost}
                        type="number"
                        value={numberOfLoss}
                        onChange={selected => setNumberOfLoss(selected)}
                      />
                      {lostLimit && (
                        <small className="text-bold">{`${lostLimit.message}. MIN: ${lostLimit.min}, MAX: ${lostLimit.max}`}</small>
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Area<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {areaList && (
                        <InputPicker
                          block
                          onChange={selected => setArea(selected)}
                          value={area}
                          data={areaList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Responsibility<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {responsibilityList && (
                        <InputPicker
                          block
                          onChange={selected => setResponsibility(selected)}
                          value={responsibility}
                          data={responsibilityList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Internal/External<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {internalExternalList && (
                        <InputPicker
                          block
                          onChange={selected =>
                            setInternalAndExternal(selected)
                          }
                          value={internalAndExternal}
                          data={internalExternalList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Shift<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {shiftList && (
                        <InputPicker
                          block
                          onChange={selected => setShift(selected)}
                          value={shift}
                          data={shiftList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Status<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {statusList && (
                        <InputPicker
                          block
                          onChange={selected => setStatus(selected)}
                          value={status}
                          data={statusList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Equipment<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {equipmentList && (
                        <CheckPicker
                          block
                          onChange={selected => setEquipment(selected)}
                          labelKey="equipment_name"
                          valueKey="equipment_id"
                          value={equipment}
                          data={equipmentList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Problem<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      {problemList && (
                        <SelectPicker
                          className="opex-select"
                          block
                          onChange={selected => setProblem(selected)}
                          value={problem}
                          data={problemList}
                          cleanable={false}
                        />
                      )}
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      Explanation<span className="text-red">*</span>
                    </div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={explanation}
                        onChange={selected => setExplanation(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">Root Cause</div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={rootCause}
                        onChange={selected => setRootCause(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">Action</div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={action}
                        onChange={selected => setAction(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">Next Action</div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={nextAction}
                        onChange={selected => setNextAction(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">PIC</div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={pic}
                        onChange={selected => setPIC(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">Due Date</div>
                    <div className="__new-col md">
                      <DatePicker
                        block
                        oneTap
                        format="DD MMM YYYY"
                        cleanable={false}
                        value={dueDate}
                        onChange={selected => setDueDate(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">Remark</div>
                    <div className="__new-col md">
                      <Input
                        componentClass="textarea"
                        maxLength={500}
                        rows={3}
                        placeholder="Description"
                        value={remarks}
                        onChange={selected => setRemarks(selected)}
                      />
                    </div>
                  </div>
                  <div className=" __new-row">
                    <div className="__new-col">
                      SAP Notification <br /> Number
                    </div>
                    <div className="__new-col md">
                      <TagPicker
                        creatable
                        data={[]}
                        style={{ width: 400 }}
                        menuStyle={{ width: 400 }}
                        value={sapNotificationNo}
                        onChange={selected => setSapNotificationNo(selected)}
                      />
                    </div>
                  </div>
                  {/*<div className=" __new-row">*/}
                  {/*  <div className="__new-col">SAP Status</div>*/}
                  {/*  <div className="__new-col md">*/}
                  {/*    {sapStatusList && (*/}
                  {/*      <CheckPicker*/}
                  {/*        block*/}
                  {/*        onChange={selected => setSapStatus(selected)}*/}
                  {/*        value={sapStatus}*/}
                  {/*        data={sapStatusList}*/}
                  {/*        cleanable={false}*/}
                  {/*      />*/}
                  {/*    )}*/}
                  {/*  </div>*/}
                  {/*</div>*/}
                </CardBody>
              </Card>
            </FilterCollapsible>
          ) : (
            GeneralHelper.loadingOnDialog()
          )}
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

export default AddNewLostcookItemDialog
