import React, { useEffect, useState, useCallback } from "react"
import FilterCollapsible from "../../shared/FilterCollapsible"
import { CardBody, Card } from "reactstrap"
import axios from "axios"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../../constants/index"
import LostcookService from "../../../services/lostcook.service"
import {
  Alert,
  Loader,
  Table,
  IconButton,
  Icon,
  Button,
  Modal,
  TagPicker,
  FlexboxGrid,
  CheckPicker
} from "rsuite"
import EditTargetDialog from "./EditTargetDialog"
import { useDispatch, useSelector } from "react-redux"
import _ from "lodash"
import EditCookSummaryTodayDialog from "./EditCookSummaryTodayDialog"
import AddNewLostcookItemDialog from "./AddNewLostcookItemDialog"
import EditHistoryDialog from "./EditHistoryDialog"
import EditLostcookItemDialog from "./EditLostcookItemDialog"
import GeneralHelper from "../../../helper/general.helper"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../../config/Can"
import { ModuleAbility } from "../../../models/ModuleAbility"
import LostcookSevice from "../../../services/lostcook.service"
import { setFiberlines } from "../../../redux/actions/lostcook.action"
const { Column, HeaderCell, Cell, Pagination } = Table

const LostcookEventDetails = ({ selectedDate, onUpdatePanel }) => {
  const [tableLostcookEvents, setTableLostcookEvents] = useState(null)
  const [page, setPage] = useState(1)
  const [displayLength, setDisplayLength] = useState(10)
  const [isEditTarget, setIsEditTarget] = useState(false)
  const [isAddNewLostcook, setIsAddNewLostcook] = useState(false)
  const [isEditCookSummary, setIsEditCookSummary] = useState(false)
  const [isEditHistory, setIsEditHistory] = useState(false)
  const [isEditLostcook, setIsEditLostcook] = useState(false)
  const [isReadLostcookItem, setIsReadLostcookItem] = useState(false)
  const [selectedLostcook, setSelectedLostcook] = useState(null)
  const [isAddNewEqAndProblem, setIsAddNewEqAndProblem] = useState(false)

  const [selectedEquipments, setSelectedEquipments] = useState([])
  const [equipments, setEquipments] = useState([])
  const [selectedProblems, setSelectedProblems] = useState([])
  const [problems, setProblems] = useState([])
  const user = useSelector(state => state.authReducer.user)

  const [editHistoryDataset, setEditHistoryDataset] = useState(null)
  const saveModifiedProductList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveModifiedProductList
  )
  const saveNewProductList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveNewProductList
  )
  const saveModifiedSummaryCookList = useSelector(
    state => state.lostcookSummaryTodayReducer.saveModifiedSummaryCookList
  )

  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)
  const mill = useSelector(state => state.appReducer.mill)

  const handleChangePage = dataKey => {
    setPage(dataKey)
  }
  const handleChangeLength = dataKey => {
    setPage(1)
    setDisplayLength(dataKey)
  }
  const getData = () => {
    return tableLostcookEvents.filter((v, i) => {
      const start = displayLength * (page - 1)
      const end = start + displayLength
      return i >= start && i < end
    })
  }

  const fetchData = useCallback(
    source => {
      LostcookService.getLostcookEventDetails(
        { displayAsDate: selectedDate },
        source
      ).then(
        data => {
          setTableLostcookEvents(data)
        },
        error => {
          if (error && error.message !== CANCEL_REQUEST) {
            Alert.error("We got an unknown error.", 5000)
          }
          console.log(error)
          return Promise.reject()
        }
      )
      getProblem(source)
      getEquipment(source)
    },
    [selectedDate]
  )

  const getProblem = source => {
    LostcookService.problemList(source).then(
      data => {
        setProblems(data)
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

  const getEquipment = source => {
    LostcookService.equipmentList(source).then(
      data => {
        setEquipments(data)
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

  useEffect(() => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    fetchData(source)
    const { millId, buId } = mill
    setModuleAbility({
      [MODULE.lcTarget]: new ModuleAbility(MODULE.lcTarget, millId, buId),
      [MODULE.lcIncident]: new ModuleAbility(MODULE.lcIncident, millId, buId),
      [MODULE.lcCookNumber]: new ModuleAbility(
        MODULE.lcCookNumber,
        millId,
        buId
      )
    })
    return () => {
      source.cancel(CANCEL_REQUEST)
    }
  }, [fetchData, mill])

  const onCancelEditCookSummary = () => {
    setIsEditCookSummary(false)
  }

  const onCancelAddNewLostcook = () => {
    setIsAddNewLostcook(false)
  }
  const onSaveNewLostcook = params => {
    if (params) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.addNewLostcookItem(
        { ...params, createdBy: user.username },
        source
      ).then(
        data => {
          if (data && data.success === true) {
            setIsAddNewLostcook(false)
            Alert.success(data.message, 2000)
            fetchData(source)
            onUpdatePanel()
          } else {
            Alert.error(data.message, 5000)
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
    } else {
      setIsAddNewLostcook(false)
    }
  }

  const onSaveEditCookSummary = selectedDateSave => {
    if (!_.isEmpty(saveModifiedSummaryCookList)) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.saveSummaryCookConfig(
        {
          modify: saveModifiedSummaryCookList,
          selectedDateSave,
          updatedBy: user.username
        },
        source
      ).then(
        data => {
          if (data && data.success === true) {
            setIsEditCookSummary(false)
            Alert.success(data.message, 2000)
            fetchData(source)
            onUpdatePanel()
          } else {
            Alert.error(data.message, 5000)
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
    } else {
      setIsEditCookSummary(false)
    }
  }

  const onCancelEditTarget = () => {
    setIsEditTarget(false)
  }
  const onSaveEditTarget = selectedYear => {
    if (!_.isEmpty(saveModifiedProductList) || !_.isEmpty(saveNewProductList)) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.saveTargetCookAndProductConfig(
        {
          modify: saveModifiedProductList,
          new: saveNewProductList,
          selectedYear,
          updatedBy: user.username
        },
        source
      ).then(
        data => {
          if (data && data.success === true) {
            setIsEditTarget(false)
            Alert.success(data.message, 2000)
            fetchData(source)
            onUpdatePanel()
          } else {
            Alert.error(data.message, 5000)
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
    } else {
      setIsEditTarget(false)
    }
  }
  const viewDetail = id => {
    if (id) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.getEditHistory({ lostcookIndex: id }, source).then(
        data => {
          setEditHistoryDataset(data)
          setIsEditHistory(true)
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
  }
  const editLosscook = (rowData, isReadOnly = false) => {
    if (rowData) {
      setSelectedLostcook(rowData)
      setIsEditLostcook(true)
      setIsReadLostcookItem(isReadOnly)
    }
  }

  const onCancelEditLostcook = () => {
    setIsEditLostcook(false)
  }
  const onSaveEditLostcook = params => {
    if (params) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.editLostcookItem(params, source).then(
        data => {
          successEditLCItem(data, source)
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
    } else {
      setIsEditLostcook(false)
    }
  }

  const successEditLCItem = (data, source) => {
    if (data && data.success === true) {
      setIsEditLostcook(false)
      Alert.success(data.message, 2000)
      fetchData(source)
      onUpdatePanel()
    } else {
      Alert.error(data.message, 5000)
    }
  }

  const deleteLostcookItem = params => {
    console.log(params)
    if (params) {
      const CancelToken = axios.CancelToken
      const source = CancelToken.source()
      LostcookService.deleteLostcookItem(params, source).then(
        data => {
          successEditLCItem(data, source)
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
    } else {
      setIsEditLostcook(false)
    }
  }
  const DateCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.DateCell({ rowData, dataKey, ...props }, "DD MMM YYYY")

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="__action_col">
        <div className="d-flex justify-content-space-center align-items-center">
          <IconButton
            onClick={() => editLosscook(rowData, true)}
            size="sm"
            className="mr-2"
            icon={<Icon icon="eye" />}
          />
          <IconButton
            onClick={() => viewDetail(rowData[dataKey])}
            size="sm"
            className="mr-2"
            icon={<Icon icon="history" />}
          />
          {moduleAbility !== null &&
            ability.can(ACTION.access, moduleAbility[MODULE.lcCookNumber]) && (
              <IconButton
                onClick={() => editLosscook(rowData)}
                size="sm"
                icon={<Icon icon="pencil" />}
              />
            )}
        </div>
      </Cell>
    )
  }

  const addNewEquipments = () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    if (selectedEquipments && selectedEquipments.length > 0) {
      LostcookService.addNewEquipment(
        {
          equipmentName: selectedEquipments,
          createdBy: user.username
        },
        source
      ).then(
        data => {
          if (data && data.success === true) {
            Alert.success(data.message, 2000)
            getEquipment(source)
          } else {
            Alert.error(data.message, 5000)
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
  }

  const addNewProblems = () => {
    const CancelToken = axios.CancelToken
    const source = CancelToken.source()
    if (selectedProblems && selectedProblems.length > 0) {
      LostcookService.addNewProblem(
        {
          problemName: selectedProblems,
          createdBy: user.username
        },
        source
      ).then(
        data => {
          if (data && data.success === true) {
            Alert.success(data.message, 2000)
            getProblem(source)
          } else {
            Alert.error(data.message, 5000)
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
  }

  const EqupmentCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="__action_col">
        {Array.isArray(rowData[dataKey]) &&
          rowData[dataKey].map((item, index) => {
            return (
              <div className="d-inline" key={index}>
                {item},
              </div>
            )
          })}
      </Cell>
    )
  }

  return (
    <>
      <FilterCollapsible header="Lostcook Incident Details">
        <Card>
          <CardBody>
            <div className="lostcook-event-details">
              <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
                <div>
                  {moduleAbility !== null &&
                    ability.can(
                      ACTION.access,
                      moduleAbility[MODULE.lcTarget]
                    ) && (
                      <Button
                        className="btn-color-primary mr-2"
                        onClick={() => setIsEditTarget(true)}
                      >
                        <Icon icon="pencil" /> Edit Target
                      </Button>
                    )}
                  {moduleAbility !== null &&
                    ability.can(
                      ACTION.access,
                      moduleAbility[MODULE.lcCookNumber]
                    ) && (
                      <Button
                        className="btn-color-primary mr-2"
                        onClick={() => setIsEditCookSummary(true)}
                      >
                        <Icon icon="pencil" /> Edit Cook Summary Today
                      </Button>
                    )}
                  {moduleAbility !== null &&
                    ability.can(
                      ACTION.access,
                      moduleAbility[MODULE.lcTarget]
                    ) && (
                      <Button
                        className="btn-color-primary mr-2"
                        onClick={() => setIsAddNewEqAndProblem(true)}
                      >
                        <Icon icon="pencil" /> Add new Equipment and Problem
                      </Button>
                    )}
                </div>
                <div>
                  {moduleAbility !== null &&
                    ability.can(
                      ACTION.access,
                      moduleAbility[MODULE.lcIncident]
                    ) && (
                      <Button
                        className="btn-color-primary"
                        onClick={() => setIsAddNewLostcook(true)}
                      >
                        <Icon icon="plus-square" /> Add New Lostcook Incident
                      </Button>
                    )}
                </div>
              </div>
              {tableLostcookEvents ? (
                <div>
                  <Table
                    height={420}
                    data={getData()}
                    bordered
                    cellBordered
                    affixHeader
                    affixHorizontalScrollbar
                  >
                    <Column width={130} fixed resizable>
                      <HeaderCell>Index</HeaderCell>
                      <Cell dataKey="lc_id" />
                    </Column>
                    <Column width={100} resizable>
                      <HeaderCell>Fiberline</HeaderCell>
                      <Cell dataKey="fiberline" />
                    </Column>

                    <Column width={150} resizable>
                      <HeaderCell>Start Date</HeaderCell>
                      <DateCell dataKey="startDate" />
                    </Column>
                    <Column width={100} resizable>
                      <HeaderCell>Shift Name</HeaderCell>
                      <Cell dataKey="shift" />
                    </Column>
                    <Column width={100} resizable>
                      <HeaderCell>Status</HeaderCell>
                      <Cell dataKey="status" />
                    </Column>
                    <Column width={100} resizable>
                      <HeaderCell>Loss</HeaderCell>
                      <Cell dataKey="lostcook" />
                    </Column>
                    <Column width={100} resizable>
                      <HeaderCell>Area</HeaderCell>
                      <Cell dataKey="area" />
                    </Column>

                    <Column width={150} resizable>
                      <HeaderCell>Responsibility</HeaderCell>
                      <Cell dataKey="responsibility" />
                    </Column>
                    <Column width={250} resizable>
                      <HeaderCell>Equipment</HeaderCell>
                      <EqupmentCell dataKey="equipment" />
                    </Column>
                    <Column width={250} resizable>
                      <HeaderCell>Problems</HeaderCell>
                      <Cell dataKey="problem" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Internal/External</HeaderCell>
                      <Cell dataKey="internalAndExternal" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Explanation</HeaderCell>
                      <Cell dataKey="lc_explanation" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Root Cause</HeaderCell>
                      <Cell dataKey="lc_root_cause" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Action</HeaderCell>
                      <Cell dataKey="lc_action" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>Next Action</HeaderCell>
                      <Cell dataKey="lc_next_action" />
                    </Column>
                    <Column width={200} resizable>
                      <HeaderCell>PIC</HeaderCell>
                      <Cell dataKey="lc_pic" />
                    </Column>
                    <Column width={200} fixed="right" resizable>
                      <HeaderCell>Action</HeaderCell>
                      <ActionCell dataKey="lc_id" />
                    </Column>
                  </Table>
                  <Pagination
                    lengthMenu={[
                      {
                        value: 10,
                        label: 10
                      },
                      {
                        value: 20,
                        label: 20
                      }
                    ]}
                    activePage={page}
                    displayLength={displayLength}
                    total={tableLostcookEvents.length}
                    onChangePage={handleChangePage}
                    onChangeLength={handleChangeLength}
                  />
                </div>
              ) : (
                <Loader content="Loading" center />
              )}
            </div>
          </CardBody>
        </Card>
      </FilterCollapsible>
      {isEditTarget && (
        <EditTargetDialog
          isEditTarget={isEditTarget}
          onCancel={onCancelEditTarget}
          onSave={onSaveEditTarget}
        />
      )}
      {isEditCookSummary && (
        <EditCookSummaryTodayDialog
          isEditCookSummary={isEditCookSummary}
          onCancel={onCancelEditCookSummary}
          onSave={onSaveEditCookSummary}
        />
      )}
      {isAddNewLostcook && (
        <AddNewLostcookItemDialog
          isAddNewLostcook={isAddNewLostcook}
          onCancel={onCancelAddNewLostcook}
          onSave={onSaveNewLostcook}
        />
      )}

      {isEditHistory && (
        <EditHistoryDialog
          isEditHis={isEditHistory}
          onClose={() => setIsEditHistory(false)}
          dataSet={editHistoryDataset}
        />
      )}
      {isEditLostcook && (
        <EditLostcookItemDialog
          onDelete={deleteLostcookItem}
          readOnly={isReadLostcookItem}
          data={selectedLostcook}
          isEditLostcook={isEditLostcook}
          onCancel={onCancelEditLostcook}
          onSave={onSaveEditLostcook}
        />
      )}
      {isAddNewEqAndProblem && (
        <Modal
          size="md"
          overflow={true}
          show={isAddNewEqAndProblem}
          onHide={() => {
            setIsAddNewEqAndProblem(false)
            setSelectedEquipments([])
          }}
          backdrop="static"
        >
          <Modal.Header>
            <Modal.Title>Add New Equipment and Problem</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-4">
              <FlexboxGrid align="top">
                <FlexboxGrid.Item colspan={3}>Equipment</FlexboxGrid.Item>
                <FlexboxGrid.Item className="ml-3">
                  {equipments && (
                    <TagPicker
                      placeholder="Type and enter to add new item"
                      onChange={selected => setSelectedEquipments(selected)}
                      data={equipments}
                      creatable
                      value={selectedEquipments}
                      labelKey="equipment_name"
                      valueKey="equipment_id"
                      style={{ width: 400 }}
                      menuStyle={{ width: 400 }}
                      disabledItemValues={equipments.map(
                        item => item.equipment_id
                      )}
                    />
                  )}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="ml-3">
                  <Button
                    onClick={() => addNewEquipments()}
                    appearance="primary"
                  >
                    Add/Edit equipments
                  </Button>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>
            <div className="mb-4">
              <FlexboxGrid align="top">
                <FlexboxGrid.Item colspan={3}>Problem</FlexboxGrid.Item>
                <FlexboxGrid.Item className="ml-3">
                  {problems && (
                    <TagPicker
                      placeholder="Type and enter to add new item"
                      onChange={selected => setSelectedProblems(selected)}
                      data={problems}
                      creatable
                      value={selectedProblems}
                      style={{ width: 400 }}
                      menuStyle={{ width: 400 }}
                      disabledItemValues={problems.map(item => item.value)}
                    />
                  )}
                </FlexboxGrid.Item>
                <FlexboxGrid.Item className="ml-3">
                  <Button onClick={() => addNewProblems()} appearance="primary">
                    Add/Edit Problems
                  </Button>
                </FlexboxGrid.Item>
              </FlexboxGrid>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default LostcookEventDetails
