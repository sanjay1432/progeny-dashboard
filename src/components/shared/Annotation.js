import React, { useCallback, useEffect, useRef, useState } from "react"
import {
  Alert,
  FormGroup,
  ControlLabel,
  FormControl,
  Schema,
  Icon,
  IconButton,
  Input,
  Modal,
  Nav,
  Table,
  Button,
  Form,
  ButtonToolbar,
  Whisper,
  Popover,
  SelectPicker
} from "rsuite"
import GeneralService from "../../services/general.service"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../constants"
import axios from "axios"
import GeneralHelper from "../../helper/general.helper"
import CheckPickerOpex from "./CheckPicker"
import moment from "moment"
import _ from "lodash"
import { useSelector } from "react-redux"
import DashboardService from "../../services/dashboard.service"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../config/Can"
import { ModuleAbility } from "../../models/ModuleAbility"
const { Column, HeaderCell, Cell } = Table
const initFormValue = {
  action: "",
  processLines: [],
  description: ""
}
const speaker = (
  <Popover title="Tips">
    <p>Click to show and edit actions</p>
  </Popover>
)
const rowKey = "annotationId"
const Annotation = ({
  isShowAnnotationDialog,
  annotationData,
  onClose,
  chartOptions,
  setChartOption,
  annotationsDate
}) => {
  const [activeTab, setActiveTab] = useState("view")
  const [annotations, setAnnotations] = useState([])
  const [editActionTempData, setEditActionTempData] = useState({})
  const [enableEditAction, setEnableEditAction] = useState(null)
  const [expandedRowKeysObj, setExpandedRowKeysObj] = useState([])
  const user = useSelector(state => state.authReducer.user)
  const [formValue, setFormValue] = useState(initFormValue)
  const [kpiSummary, setKpiSummary] = useState([])
  const [selectedKpiProcessLines, setSelectedKpiProcessLines] = useState(null)
  const displayAsDate = useSelector(
    state => state.dashboardReducer.displayAsDate
  )
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)
  let form = useRef(null)

  const { StringType, ArrayType } = Schema.Types
  const model = Schema.Model({
    description: StringType().isRequired("Description is required."),
    processLines: ArrayType().isRequired(
      "Please select at least one process line."
    )
  })

  const getAnnotations = useCallback(() => {
    if (annotationData) {
      const source = axios.CancelToken.source()
      GeneralService.getAnnotation(
        {
          millId: annotationData.millId,
          buId: annotationData.buId,
          kpiId: annotationData.kpiId,
          annotationDate: moment(annotationData.annotationDate).format(
            "YYYY-MM-DD"
          )
        },
        source
      ).then(
        data => {
          setAnnotations(data)
          let tempData = {}
          let tempDataEdit = {}
          data.forEach(ann => {
            tempData[ann.annotationId] = ann.action
            tempDataEdit[ann.annotationId] = true
          })
          setEditActionTempData(tempData)
          setEnableEditAction(tempDataEdit)
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
  }, [annotationData])

  const getSummary = useCallback(
    processLines => {
      if (annotationData && displayAsDate) {
        const source = axios.CancelToken.source()
        const param = {
          buId: annotationData.buId,
          millId: annotationData.millId,
          displayAsDate,
          processLines
        }
        DashboardService.getSummary(param, source).then(
          data => {
            setKpiSummary(data)
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
    [displayAsDate, annotationData]
  )

  useEffect(() => {
    if (annotationData) {
      const firstProcessLine = annotationData.processLines[0]
        ? annotationData.processLines[0].processLineCode
        : null
      if (firstProcessLine) {
        setSelectedKpiProcessLines(firstProcessLine)
        setExpandedRowKeysObj([])
        getAnnotations()
        getSummary([firstProcessLine])
      }
      setModuleAbility({
        [MODULE.annotation]: new ModuleAbility(
          MODULE.annotation,
          annotationData.millId,
          annotationData.buId
        )
      })
    }
  }, [getAnnotations, getSummary, annotationData])

  const DateCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.DateCell({ rowData, dataKey, ...props })

  const ExpandCell = ({
    rowData,
    dataKey,
    expandedRowKeys,
    onChange,
    ...props
  }) => (
    <Cell {...props}>
      <Whisper
        placement="top"
        trigger="hover"
        speaker={speaker}
        delayShow={1000}
        delayHide={0}
      >
        <IconButton
          size="xs"
          appearance="subtle"
          onClick={() => {
            onChange(rowData)
          }}
          icon={
            <Icon
              icon={
                expandedRowKeys.some(key => key === rowData[rowKey])
                  ? "minus-square-o"
                  : "plus-square-o"
              }
            />
          }
        />
      </Whisper>
    </Cell>
  )

  const onSaveAction = data => {
    if (data && editActionTempData && data.annotationId) {
      const annotationId = data.annotationId
      const actionEdited = editActionTempData[annotationId]
      if (data.action !== actionEdited) {
        const source = axios.CancelToken.source()
        const param = {
          annotationId: annotationId,
          userId: user.username,
          action: actionEdited
        }
        GeneralService.editAnnotation(param, source).then(
          data1 => {
            Alert.success("Modified successfully!!!", 5000)
            getAnnotations()
            getAnnotations()
          },
          error => {
            if (error && error.message !== CANCEL_REQUEST) {
              Alert.error("We got an unknown error.", 5000)
            }
            console.log(error)
            return Promise.reject()
          }
        )
      } else {
        Alert.info("Please change the action.", 2000)
      }
    }
  }

  const onClickEditAction = (annotationId, disable) => {
    setEnableEditAction({
      ...enableEditAction,
      [annotationId]: disable
    })
  }
  const onCancelEdit = rowData => {
    onClickEditAction(rowData.annotationId, true)
    setEditActionTempData({
      ...editActionTempData,
      [rowData.annotationId]: rowData.action
    })
  }
  const ActionsDetail = rowData => {
    return (
      <div>
        <Form fluid>
          <FormGroup>
            <ControlLabel>
              Action <span> </span>
              {moduleAbility !== null &&
                ability.can(ACTION.edit, moduleAbility[MODULE.annotation]) && (
                  <IconButton
                    onClick={() =>
                      onClickEditAction(rowData.annotationId, false)
                    }
                    size="xs"
                    appearance="subtle"
                    icon={<Icon icon="edit" />}
                  />
                )}
            </ControlLabel>
            <Input
              rows={5}
              maxLength={500}
              disabled={enableEditAction[rowData.annotationId]}
              value={editActionTempData[rowData.annotationId]}
              name="textarea"
              onChange={selected =>
                setEditActionTempData({
                  ...editActionTempData,
                  [rowData.annotationId]: selected
                })
              }
              componentClass="textarea"
            />
          </FormGroup>
          {enableEditAction && !enableEditAction[rowData.annotationId] && (
            <ButtonToolbar>
              <Button
                appearance="primary"
                onClick={() => onSaveAction(rowData)}
              >
                Add
              </Button>
              <Button
                appearance="default"
                onClick={() => onCancelEdit(rowData)}
              >
                Cancel
              </Button>
            </ButtonToolbar>
          )}
        </Form>
      </div>
    )
  }

  const addAnnotation = () => {
    if (!form.check()) {
      Alert.error("Please check the error in the form.", 2000)
      return
    }
    try {
      const source = axios.CancelToken.source()
      GeneralService.addAnnotation(
        {
          millId: annotationData.millId,
          buId: annotationData.buId,
          kpiId: annotationData.kpiId,
          annotationDate: moment(annotationData.annotationDate).format(
            "YYYY-MM-DD"
          ),
          processLines: _.toString(formValue.processLines),
          description: formValue.description,
          action: formValue.action,
          userLoginId: user.username
        },
        source
      ).then(
        data => {
          Alert.success(
            "Added new annotation on " +
              moment(annotationData.annotationDate).format("DD MMM YYYY"),
            5000
          )
          setFormValue(initFormValue)
          getAnnotations()
          let chartOpt = _.cloneDeep(chartOptions)
          if (chartOpt) {
            let anno = annotationsDate
            anno.push(
              moment(annotationData.annotationDate).format("YYYY-MM-DD")
            )
            chartOpt.xAxis.axisLabel.formatter = value =>
              GeneralHelper.chartDateFormatterAnnotation(anno, value)
            setChartOption(chartOpt)
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
    } catch (err) {
      console.log(err)
      Alert.error(
        "Can't save the annotation, please contact support team to help",
        7000
      )
    }
  }

  const onChangeProcessLine = selected => {
    setSelectedKpiProcessLines(selected)
    getSummary([selected])
  }

  return (
    <>
      <Modal
        size="lg"
        overflow={false}
        show={isShowAnnotationDialog}
        onHide={() => onClose()}
      >
        <Modal.Header>
          <Modal.Title>
            Annotation on{" "}
            {annotationData
              ? moment(annotationData.annotationDate).format("DD MMM YYYY")
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Nav
            appearance="tabs"
            activeKey={activeTab}
            onSelect={activeKey => setActiveTab(activeKey)}
          >
            {moduleAbility !== null &&
              ability.can(ACTION.add, moduleAbility[MODULE.annotation]) && (
                <Nav.Item eventKey="createNew">Create New</Nav.Item>
              )}
            {moduleAbility !== null &&
              ability.can(ACTION.read, moduleAbility[MODULE.annotation]) && (
                <Nav.Item eventKey="view">View</Nav.Item>
              )}
            {moduleAbility !== null &&
              ability.can(ACTION.read, moduleAbility[MODULE.annotation]) && (
                <Nav.Item eventKey="kpiSummary">Kpi Summary</Nav.Item>
              )}
          </Nav>
          {activeTab === "createNew" &&
          moduleAbility !== null &&
          ability.can(ACTION.add, moduleAbility[MODULE.annotation]) ? (
            <div className="custom-tab">
              <Form
                model={model}
                ref={ref => (form = ref)}
                formValue={formValue}
                fluid
                onChange={value => {
                  setFormValue({
                    ...formValue,
                    ...value
                  })
                }}
              >
                <FormGroup>
                  <ControlLabel>
                    Process Line<span className="text-red">*</span>
                  </ControlLabel>
                  <FormControl
                    name="processLines"
                    accepter={CheckPickerOpex}
                    value={formValue.selectedProcessLines}
                    className="c-picker"
                    data={annotationData.processLines || []}
                    labelKey="processLineName"
                    valueKey="processLineCode"
                    placeholder="Process Line"
                    onChange={selected =>
                      setFormValue({
                        ...formValue,
                        processLines: selected
                      })
                    }
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>
                    Description<span className="text-red">*</span>
                  </ControlLabel>
                  <FormControl
                    name="description"
                    maxLength={500}
                    accepter={Input}
                    value={formValue.description}
                    onChange={selected =>
                      setFormValue({
                        ...formValue,
                        description: selected
                      })
                    }
                    componentClass="textarea"
                    rows={3}
                    placeholder="Description"
                  />
                </FormGroup>
                <FormGroup>
                  <ControlLabel>Action</ControlLabel>
                  <FormControl
                    name="action"
                    maxLength={500}
                    accepter={Input}
                    value={formValue.action}
                    onChange={selected =>
                      setFormValue({
                        ...formValue,
                        action: selected
                      })
                    }
                    componentClass="textarea"
                    rows={3}
                    placeholder="Action"
                  />
                </FormGroup>
                <ButtonToolbar>
                  <Button
                    appearance="primary"
                    type="submit"
                    onClick={addAnnotation}
                  >
                    Save
                  </Button>
                </ButtonToolbar>
              </Form>
            </div>
          ) : (
            ""
          )}
          {activeTab === "view" &&
          moduleAbility !== null &&
          ability.can(ACTION.read, moduleAbility[MODULE.annotation]) ? (
            <div className="custom-tab">
              <Table
                height={300}
                data={annotations}
                bordered
                cellBordered
                affixHeader
                rowKey={rowKey}
                expandedRowKeys={expandedRowKeysObj}
                renderRowExpanded={rowData => ActionsDetail(rowData)}
                rowExpandedHeight={220}
              >
                <Column width={70} align="center">
                  <HeaderCell>#</HeaderCell>
                  <ExpandCell
                    dataKey="annotationId"
                    expandedRowKeys={expandedRowKeysObj}
                    onChange={(rowData, dataKey) =>
                      GeneralHelper.handleExpanded(
                        rowData,
                        dataKey,
                        rowKey,
                        expandedRowKeysObj,
                        setExpandedRowKeysObj
                      )
                    }
                  />
                </Column>
                <Column flexGrow={1}>
                  <HeaderCell>Description</HeaderCell>
                  <Cell dataKey="description" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Process Line</HeaderCell>
                  <Cell dataKey="processLines" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Date</HeaderCell>
                  <DateCell dataKey="annotationDate" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>User</HeaderCell>
                  <Cell dataKey="userId" />
                </Column>
              </Table>
            </div>
          ) : (
            ""
          )}
          {activeTab === "kpiSummary" &&
          moduleAbility !== null &&
          ability.can(ACTION.read, moduleAbility[MODULE.annotation]) ? (
            <div className="custom-tab">
              <SelectPicker
                className="opex-select mb-4"
                searchable={false}
                cleanable={false}
                value={selectedKpiProcessLines}
                data={annotationData.processLines || []}
                labelKey="processLineName"
                valueKey="processLineCode"
                placeholder="Process Line"
                onSelect={selected => onChangeProcessLine(selected)}
              />
              <Table data={kpiSummary} bordered cellBordered affixHeader>
                <Column flexGrow={1}>
                  <HeaderCell>KPI</HeaderCell>
                  <Cell dataKey="kpiName" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Unit</HeaderCell>
                  <Cell dataKey="kpiUnit" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Target</HeaderCell>
                  <Cell dataKey="threshold" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Daily</HeaderCell>
                  <Cell dataKey="todayValue" />
                </Column>
                <Column width={120} resizable>
                  <HeaderCell>Mtd</HeaderCell>
                  <Cell dataKey="avgMtdValue" />
                </Column>
              </Table>
            </div>
          ) : (
            ""
          )}
        </Modal.Body>
      </Modal>
    </>
  )
}

export default Annotation
