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
  InputNumber,
  Popover,
  Whisper,
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
import _ from "lodash"
import GeneralHelper from "../../../helper/general.helper"

const EditLostcookItemDialog = ({
  isEditLostcook,
  onSave,
  onCancel,
  data,
  onDelete,
  readOnly = false
}) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [fiberLineList, setFiberlineList] = useState(null)
  const [areaList, setAreaList] = useState(null)
  const [responsibilityList, setResponsibilityList] = useState(null)
  const [problemList, setProblemList] = useState(null)
  const [equipmentList, setEquipmentList] = useState(null)
  const [fiberLine, setFiberline] = useState(1)
  const [internalExternalList, setInternalExternalList] = useState(null)
  const [startDate, setStartDate] = useState(new Date())
  const [numberOfLoss, setNumberOfLoss] = useState(0)
  const [area, setArea] = useState(1)
  const [responsibility, setResponsibility] = useState(1)
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
  const [sapNos, setSapNos] = useState([])
  const user = useSelector(state => state.authReducer.user)
  const mill = useSelector(state => state.appReducer.mill)
  const [lostLimit, setLostLimit] = useState({
    min: 0,
    max: 0,
    message: ""
  })
  const [canEditLost, setCanEditLost] = useState(false)
  const [statusList, setStatusList] = useState([])
  const [shiftList, setShiftList] = useState([])
  const [shift, setShift] = useState(null)
  const [status, setStatus] = useState(null)
  const [sapStatusList, setSapStatusList] = useState([])
  const [sapStatus, setSapStatus] = useState(null)
  const [confirmMessage, setConfirmMessage] = useState("")

  const dispatch = useDispatch()
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
      explanation
    ) {
      onSave({
        lc_id: data.lc_id,
        updatedBy: user.username,
        fiberLine,
        startDate,
        numberOfLoss,
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
        sapNotificationNo,
        status,
        shift
      })
    } else {
      Alert.error("Please input all the required fields.", 5000)
    }
  }

  const cancel = () => {
    if (isModifiedConfig) {
      setConfirmMessage(
        "You will lost your changes, Are you sure you want to proceed?"
      )
      setShowConfirmDialog(true)
    } else {
      onCancel()
    }
  }
  const speaker = (
    <Popover title="Confirmation!">
      <p>
        {"Do you want to delete lostcook item:"}
        <strong className="text-bold">{data && data.lc_id}</strong>
        {"?"}
      </p>
      <p>
        <Button onClick={() => deleteItem()} color="red" className="float-left">
          Yes, please delete!
        </Button>
      </p>
    </Popover>
  )

  const deleteItem = () => {
    onDelete({ lc_id: data.lc_id, updatedBy: user.username })
  }

  const onYesConfirmDialog = () => {
    onCancel()
    setShowConfirmDialog(false)
  }

  const onNoConfirmDialog = () => {
    setShowConfirmDialog(false)
  }

  const fetchAndSetData = useCallback(
    source => {
      if (isEditLostcook) {
        LostcookService.fiberlineList({ millId: mill.millId }, source).then(
          list => {
            setFiberlineList(list.filter(item => item.value !== "all"))
            const selected = _.find(list, ["label", data.fiberline])
            if (selected) {
              setFiberline(selected.value)
              setCanEditLost(selected.editable)
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
        LostcookService.areaList(source).then(
          list => {
            setAreaList(list)
            const selected = _.find(list, ["label", data.area])
            if (selected) {
              setArea(selected.value)
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
        LostcookService.responsibilityList(source).then(
          list => {
            setResponsibilityList(list)
            const selected = _.find(list, ["label", data.responsibility])
            if (selected) {
              setResponsibility(selected.value)
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
        LostcookService.problemList(source).then(
          list => {
            setProblemList(list)
            const selected = _.find(list, ["label", data.problem])
            if (selected) {
              setProblem(selected.value)
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
        LostcookService.equipmentList(source).then(
          list => {
            setEquipmentList(list)
            if (data.equipment && Array.isArray(data.equipment)) {
              let selectedEq = []
              data.equipment.forEach(equipmentItem => {
                const selected = _.find(list, ["equipment_name", equipmentItem])
                if (selected) {
                  selectedEq.push(selected.equipment_id)
                }
              })
              setEquipment(selectedEq)
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

        LostcookService.externalAndInternal(source).then(
          list => {
            setInternalExternalList(list)
            const selected = _.find(list, ["label", data.internalAndExternal])
            if (selected) {
              setInternalAndExternal(selected.value)
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

        LostcookService.shiftList(source).then(
          list => {
            setShiftList(list)
            const selected = _.find(list, ["label", data.shift])
            if (selected) {
              setShift(selected.value)
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

        LostcookService.statusList(source).then(
          list => {
            setStatusList(list)
            const selected = _.find(list, ["label", data.status])
            if (selected) {
              setStatus(selected.value)
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
        setStartDate(new Date(data.startDate))
        setNumberOfLoss(data.lostcook)
        setExplanation(data.lc_explanation)
        setRootCause(data.lc_root_cause)
        setAction(data.lc_action)
        setNextAction(data.lc_next_action)
        setPIC(data.lc_pic)
        setDueDate(new Date(data.lc_due_date))
        setRemarks(data.lc_remark)
        if (data.qmnum && Array.isArray(data.qmnum)) {
          let sap = []
          data.qmnum.forEach(q => {
            sap.push({
              label: q,
              value: q
            })
          })
          setSapNos(sap)
          setSapNotificationNo(data.qmnum)
        }
        return () => {
          source.cancel(CANCEL_REQUEST)
        }
      }
    },
    [isEditLostcook]
  )

  useEffect(() => {
    if (isEditLostcook) {
      dispatch(setSaveModifiedSummaryCookList([]))
      dispatch(setModifiedConfig(false))
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      fetchAndSetData(source)
    }
  }, [isEditLostcook, dispatch, fetchAndSetData])

  useEffect(() => {
    if (isEditLostcook && fiberLine) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.getLossLimit(
        { startDate, fiberLine, lc_id: data.lc_id },
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
  }, [isEditLostcook, startDate, fiberLine])

  return (
    <>
      <Modal
        full
        overflow={true}
        show={isEditLostcook}
        onHide={() => cancel()}
        backdrop={readOnly ? true : "static"}
      >
        <Modal.Header>
          <Modal.Title>
            {readOnly ? "View" : "Edit"} Lostcook Item: {data.lc_id || ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {data &&
          areaList &&
          responsibilityList &&
          internalExternalList &&
          statusList &&
          equipmentList &&
          problemList &&
          shiftList ? (
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
                        disabled={readOnly}
                      />
                    )}
                  </div>
                </div>
                <div className=" __new-row">
                  <div className="__new-col">
                    Start Date<span className="text-red">*</span>
                  </div>
                  <div className="__new-col md">
                    {startDate ? (
                      <DatePicker
                        block
                        oneTap
                        format="DD MMM YYYY"
                        cleanable={false}
                        value={startDate}
                        onChange={selected => setStartDate(selected)}
                        disabled={readOnly}
                      />
                    ) : (
                      <Loader />
                    )}
                  </div>
                </div>
                <div className=" __new-row">
                  <div className="__new-col">
                    Number of Lost
                    {canEditLost && <span className="text-red">*</span>}
                  </div>
                  <div className="__new-col md">
                    <InputNumber
                      max={lostLimit.max}
                      min={lostLimit.min}
                      disabled={!canEditLost || readOnly}
                      type="number"
                      value={numberOfLoss}
                      onChange={selected => setNumberOfLoss(selected)}
                    />
                    <small className="text-bold">{`${lostLimit.message}. MIN: ${lostLimit.min}, MAX: ${lostLimit.max}`}</small>
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
                        disabled={readOnly}
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
                        disabled={readOnly}
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
                        onChange={selected => setInternalAndExternal(selected)}
                        value={internalAndExternal}
                        data={internalExternalList}
                        cleanable={false}
                        disabled={readOnly}
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
                        disabled={readOnly}
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
                        disabled={readOnly}
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
                        disabled={readOnly}
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
                      <InputPicker
                        block
                        onChange={selected => setProblem(selected)}
                        value={problem}
                        data={problemList}
                        cleanable={false}
                        disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
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
                      disabled={readOnly}
                    />
                  </div>
                </div>
                <div className=" __new-row">
                  <div className="__new-col">
                    SAP Notification <br></br> Number
                  </div>
                  <div className="__new-col md">
                    <TagPicker
                      creatable
                      data={sapNos}
                      style={{ width: 400 }}
                      menuStyle={{ width: 400 }}
                      value={sapNotificationNo}
                      onChange={selected => setSapNotificationNo(selected)}
                      disabled={readOnly}
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          ) : (
            GeneralHelper.loadingOnDialog()
          )}
        </Modal.Body>
        <Modal.Footer>
          {!readOnly && (
            <Whisper trigger="click" speaker={speaker}>
              <Button color="red" className="float-left">
                Delete
              </Button>
            </Whisper>
          )}

          <Button onClick={() => cancel()} appearance="subtle">
            Cancel
          </Button>
          {!readOnly && (
            <Button onClick={() => save()} appearance="primary">
              Save
            </Button>
          )}
        </Modal.Footer>
      </Modal>
      <Confirm
        message={confirmMessage}
        isOpen={showConfirmDialog}
        onYes={() => onYesConfirmDialog()}
        onNo={() => onNoConfirmDialog()}
      />
    </>
  )
}

export default EditLostcookItemDialog
