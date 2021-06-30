import React, { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setBreadcrumb } from "../../redux/actions/app.action"
import UserService from "../../services/user.service"
import AssignEstate from "../../components/modal/user/userAssignment/AssignEstate"
import AssignUser from "../../components/modal/user/estateAssignment/AssignUser"
import DeleteModal from "../../components/modal/DeleteModal"
import SuccessModal from "../modal/masterData/success/success"
import { progenySubject } from "../../services/pubsub.service"
import DataPicker from "components/progeny/sharedComponent/DataPicker"
import {
  Table,
  FlexboxGrid,
  Button,
  InputPicker,
  Grid,
  Row,
  Col,
  Checkbox,
  Pagination,
  Message,
  Input,
  IconButton,
  Icon,
  Tooltip,
  Whisper
} from "rsuite"
import OpenNew from "../../assets/img/icons/open_in_new_24px.svg"
import LinkIcon from "../../assets/img/icons/link_24px.svg"
import CreateIcon from "../../assets/img/icons/create_24px.svg"
import QrCodeScanner from "../../assets/img/icons/qr_code_scanner_24px.svg"
import AccountCircle from "../../assets/img/icons/account_circle_24px.svg"
import ConfirmationModal from "components/modal/sharedComponent/ConfirmationModal"
import PalmService from "services/palm.service"
import PlotService from "services/plot.service"

const { Column, HeaderCell, Cell } = Table
const initialState = {
  displaylength: 10,
  prev: true,
  next: true,
  first: false,
  last: false,
  ellipsis: true,
  boundaryLinks: true,
  activePage: 1
}
// let tableData = []

const EditableCell = ({
  rowData,
  dataKey,
  onChange,
  handlePlotEditChange,
  handlePalmEditChange,
  active,
  dashboardData,
  ...cellProps
}) => {
  const editing = rowData.status === true
  switch (active) {
    case "plot":
      return (
        <Cell {...cellProps}>
          {editing && dataKey === "progenyId" ? (
            <DataPicker
              dataType="progenyId"
              OriginalData={dashboardData.result.plot}
              dataValue={rowData[dataKey]}
              onChange={value =>
                handlePlotEditChange(rowData.trialid, dataKey, value)
              }
            />
          ) : editing && dataKey !== "progenyId" ? (
            <Input
              defaultValue={rowData[dataKey]}
              disabled={[
                "trialid",
                "estate",
                "replicate",
                "estateblock",
                "design",
                "density",
                "progeny",
                "ortet",
                "fp",
                "mp",
                "noofPalm"
              ].includes(dataKey)}
              onChange={value =>
                handlePlotEditChange(rowData.trialid, dataKey, value)
              }
            />
          ) : (
            <span>{rowData[dataKey]}</span>
          )}
        </Cell>
      )
    case "palm":
      return (
        <Cell {...cellProps}>
          {rowData.status === true ? (
            <Input
              defaultValue={rowData[dataKey]}
              disabled={[
                "trialid",
                "estate",
                "replicate",
                "estateblock",
                "plot"
              ].includes(dataKey)}
              onChange={(value, e) =>
                handlePalmEditChange(rowData.trialid, dataKey, e.target.value)
              }
            />
          ) : (
            <span>{rowData[dataKey]}</span>
          )}
        </Cell>
      )
    default:
      return null
  }
}

let currentTableDataFields = []
const DataTable = ({ currentSubNavState, currentItem, ...props }) => {
  const dispatch = useDispatch()
  useEffect(() => {
    currentTableDataFields = []
    // SET TABLE DATA
    setCurrentTableData()
  })
  const attachProgeny = (
    <Tooltip>
      The plots that are in this Trial has already been attached to its own
      unique progeny.
    </Tooltip>
  )
  const editProgeny = (
    <Tooltip>
      You are unable to edit the data for this value because it has data already
      attached to palms.
    </Tooltip>
  )
  const [successMessage, setSuccessMessage] = useState(false)
  const [successData, setSuccessData] = useState(null)
  const [errorMessage, setErrorMessage] = useState("")
  const [errorData, setErrorData] = useState("")
  const [confirmationModal, setConfirmationModal] = useState(false)
  const [confirmationData, setConfirmationData] = useState("")
  const [isSuccessModal, setSuccessModal] = useState(false)
  const [assignUserModal, setAssignUserModal] = useState(false)
  const [estate, setEstate] = useState("")
  const [selectedItem, setSelectedItem] = useState([])
  const [assignEstateModal, setAssignEstateModal] = useState(false)
  const [username, setUsername] = useState("")
  const [isDeleteModal, setDeleteModal] = useState(false)
  const [rowsToDelete, setRowsToDelete] = useState([])
  const [pagination, setPagination] = useState(initialState)
  const [checkStatus, setCheckStatus] = useState([])
  const { activePage, displaylength } = pagination
  const { active } = currentSubNavState
  const [tableData, setTableData] = useState([])
  const [originalData, setOriginalData] = useState([])

  useEffect(() => {
    function subscribedData(data) {
      itemSaved(data)
    }
    progenySubject.subscribe(data => {
      subscribedData(data)
    })
  }, [])

  function itemSaved(payload) {
    if (payload && payload.type === "TRIAL") {
      console.log(payload)
      setSuccessData(payload)
      setSuccessModal(true)
    } else if (
      (payload && payload.type === "PROGENY_ADD") ||
      payload.type === "PROGENY_EDIT" ||
      payload.type === "USERLIST_ADD" ||
      payload.type === "USERLIST_EDIT"
    ) {
      setSuccessData(payload)
      setSuccessMessage(active)
    }
  }

  function CloseSuccessModal() {
    setSuccessModal(false)
  }

  const tableDataFields = [
    {
      label: "Estate",
      value: "estate"
    },
    {
      label: "Estate Full Name",
      value: "estatefullname"
    },
    {
      label: "No of Estate Block",
      value: "noofestateblock"
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails"
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails"
    },
    {
      label: "Trial ID",
      value: "trialid"
    },
    {
      label: "Trial",
      value: "trial"
    },
    {
      label: "Trial Remarks",
      value: "trialremark"
    },
    {
      label: "Area (ha)",
      value: "area"
    },
    {
      label: "Planted Date",
      value: "planteddate"
    },
    {
      label: "n Progeny",
      value: "nofprogeny"
    },
    {
      label: "n Of Replicate",
      value: "nofreplicate"
    },
    {
      label: "n Of Plot",
      value: "nofplot"
    },
    {
      label: "n Of Subblock/Rep",
      value: "nofsubblock"
    },
    {
      label: "n Of Plot/subblock",
      value: "nofplot_subblock"
    },
    {
      label: "Status",
      value: "status"
    },
    {
      label: "Replicate",
      value: "replicate"
    },
    {
      label: "Estate Block",
      value: "estateblock"
    },
    {
      label: "Design",
      value: "design"
    },
    {
      label: "Density",
      value: "density"
    },
    {
      label: "Plot",
      value: "plot"
    },
    {
      label: "Subblock",
      value: "subblock"
    },
    {
      label: "Progeny ID",
      value: "progenyId"
    },
    {
      label: "Progeny",
      value: "progeny"
    },
    {
      label: "Ortet",
      value: "ortet"
    },
    {
      label: "FP",
      value: "fp"
    },
    {
      label: "MP",
      value: "mp"
    },
    {
      label: "nPalm",
      value: "noofPalm"
    },
    {
      label: "Palm No",
      value: "palmno"
    },
    {
      label: "Palm Name",
      value: "palmname"
    },
    {
      label: "Progeny ID",
      value: "progenyId"
    },
    {
      label: "Pop Var",
      value: "popvar"
    },
    {
      label: "Origin",
      value: "origin"
    },
    {
      label: "Progeny Remark",
      value: "progenyremark"
    },
    {
      label: "Progeny Remark",
      value: "progenyremark"
    },
    {
      label: "Generation",
      value: "generation"
    },
    {
      label: "FP Fam",
      value: "fpFam"
    },
    {
      label: "FP Var",
      value: "fpVar"
    },
    {
      label: "MP Fam",
      value: "mpFam"
    },
    {
      label: "MP Var",
      value: "mpVar"
    },
    {
      label: "Cross",
      value: "cross"
    },
    {
      label: "Cross Type",
      value: "crossType"
    },
    {
      label: "User ID",
      value: "userId"
    },
    {
      label: "Username",
      value: "username"
    },
    {
      label: "Position",
      value: "position"
    }
  ]

  const perpage = [
    {
      label: "10",
      value: "10"
    },
    {
      label: "20",
      value: "20"
    },
    {
      label: "50",
      value: "50"
    },
    {
      label: "100",
      value: "100"
    }
  ]
  function handleChangePage(dataKey) {
    setPagination(() => ({ ...pagination, activePage: dataKey }))
  }
  function handleChangeLength(dataKey) {
    setPagination(() => ({
      ...pagination,
      displaylength: dataKey
    }))
  }

  function getNoPages() {
    const { displaylength } = pagination
    return Math.ceil(tableData.length / displaylength)
  }

  const filterData = useSelector(state => state.filterReducer)

  const dashboardData = useSelector(state => state.dashboardDataReducer)
  function setCurrentTableData() {
    if (dashboardData.result[active]) {
      setTableData(dashboardData.result[active])
      const firstRow = dashboardData.result[active][0]
      // tableData = dashboardData.result[active]
      const availableKeys = Object.keys(firstRow)

      availableKeys.forEach(key => {
        const field = tableDataFields.find(field => field.value === key)
        if (field) {
          currentTableDataFields.push(field)
        }
      })
    }
  }

  function getData(displaylength) {
    let currentTableData = [...tableData]
    if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
      currentTableData = filterTable(filterData.filter, currentTableData)
    }
    return currentTableData.filter((v, i) => {
      v["check"] = false
      v["rowNumber"] = i
      const start = displaylength * (activePage - 1)
      const end = start + displaylength
      return i >= start && i < end
    })
  }
  console.log(tableData)
  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some(item => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  )

  let checked = false
  let indeterminate = false
  let disabled = true

  if (checkStatus.length === 0) {
    disabled = true
  } else if (checkStatus.length > 0 && checkStatus.length < tableData.length) {
    indeterminate = true
    disabled = false
  } else if (checkStatus.length === tableData.length) {
    checked = true
    disabled = false
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? tableData.map(item => item.rowNumber) : []
    setCheckStatus(keys)
  }

  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter(item => item !== value)
    setCheckStatus(keys)
  }

  function openConfirmationModal(rowData) {
    setConfirmationModal(true)
    setConfirmationData(rowData)
  }

  function closeConfirmationModal() {
    setConfirmationModal(false)
    setErrorMessage("")
  }

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters)
    return data.filter(function (eachObj) {
      return filterKeys.every(function (eachKey) {
        return eachObj[eachKey] === filters[eachKey]
      })
    })
  }

  function AddButton() {
    switch (active) {
      // case "estate":
      //   return (
      //     <Col sm={5} md={5} lg={4}>
      //       <FlexboxGrid.Item>
      //         <Button
      //           appearance="primary"
      //           className="addEstateButton"
      //           disabled
      //         >
      //           Add Estate
      //         </Button>
      //       </FlexboxGrid.Item>
      //     </Col>
      //   )
      case "trial":
        return (
          <Col sm={5} md={5} lg={4}>
            <FlexboxGrid.Item className="alignButtonCenter">
              <Button
                appearance="primary"
                className="addTrialButton"
                onClick={() =>
                  handleAddNewTrial(
                    ["Trial and Replicate", `Add New Trial & Replicate`],
                    {
                      trial: null,
                      type: "create"
                    }
                  )
                }
              >
                Add New Trial
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "plot":
        return (
          <Col sm={5} md={5} lg={5}>
            <FlexboxGrid.Item className="alignButtonCenter">
              <Button appearance="primary" className="attachProgeniesButton">
                Attach Progenies
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "palm":
        return null
      case "progeny":
        return (
          <Col sm={5} md={6} lg={5}>
            <FlexboxGrid.Item className="alignButtonCenter">
              <Button
                appearance="primary"
                className="addProgenyButton"
                onClick={() =>
                  handleAddNewTrial(["Progeny", `Add New Progeny`], {
                    type: "add"
                  })
                }
              >
                Add New Progeny
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "userlist":
        function openPage() {
          handleActionExpand(["User List", "Add New User"], {})
        }
        return (
          <Col sm={5} md={5} lg={4}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addUserButton"
                onClick={openPage}
              >
                Add New User
              </Button>
            </FlexboxGrid.Item>
          </Col>
        )
      case "estateAssignment":
        return null
      case "userAssignment":
        return null
      default:
        return null
    }
  }

  function DeleteButton() {
    if (active === "progeny") {
      return (
        <Col sm={4} md={4} lg={4}>
          <FlexboxGrid.Item>
            <div className="deleteButtonLayout">
              <Button
                className="deleteButton"
                disabled={disabled}
                onClick={onDelete}
              >
                Delete
              </Button>
            </div>
          </FlexboxGrid.Item>
        </Col>
      )
    } else {
      return null
    }
  }

  function StatusButton({ status }) {
    switch (status) {
      case "active":
        return (
          <Button
            color="green"
            appearance="ghost"
            className="activeStatusButton"
          >
            Active
          </Button>
        )
      case "inactive":
        return (
          <Button
            color="red"
            appearance="ghost"
            className="inavtiveStatusButton"
          >
            Inactive
          </Button>
        )
      case "canceled":
        return (
          <Button
            color="red"
            appearance="ghost"
            className="canceledStatusButton"
          >
            canceled
          </Button>
        )
      case "finished":
        return (
          <Button
            color="yellow"
            appearance="ghost"
            className="finishedStatusButton"
          >
            finished
          </Button>
        )

      default:
        return null
    }
  }

  const handlePlotEditChange = (trialid, key, value) => {
    const nextData = Object.assign([], tableData)
    nextData.find(item => item.trialid === trialid)[key] = value
    setTableData(nextData)
  }

  const handlePalmEditChange = (trialid, key, value) => {
    const nextData = Object.assign([], tableData)
    nextData.find(item => item.trialid === trialid)[key] = value
    setTableData(nextData)
  }

  function handlePlotEditStatus(trialid) {
    const nextData = Object.assign([], tableData)
    const activeItem = nextData.find(item => item.trialid === trialid)
    activeItem.status = activeItem.status ? null : true
    setTableData(nextData)
  }

  function savePlotData(trialid) {
    const nextData = Object.assign([], tableData)
    const activeItem = nextData.find(item => item.trialid === trialid)
    activeItem.status = activeItem.status ? null : true
    console.log(confirmationData)
    PlotService.editPlot(confirmationData).then(
      data => {
        setTableData(nextData)
        setConfirmationModal(false)
        setSuccessMessage(active)
        setSuccessData(confirmationData)
      },
      error => {
        setErrorMessage(active)
        setErrorData(error.message)
      }
    )
  }

  function handlePalmEditStatus(trialid) {
    const nextData = Object.assign([], tableData)
    const activeItem = nextData.find(item => item.trialid === trialid)
    activeItem.status = activeItem.status ? false : true
    setTableData(nextData)
  }

  useEffect(() => {
    PalmService.getPalmData().then(response => {
      const originalPalmData = response.data
      setOriginalData(originalPalmData)
    })
  }, [])

  function cancelPalmData(trialid) {
    const nextData = Object.assign([], tableData)
    const activeItem = originalData.find(item => item.trialid === trialid)
    activeItem.status = activeItem.status ? false : true
    setTableData(nextData)
  }

  function savePalmData(trialid) {
    const nextData = Object.assign([], tableData)
    const activeItem = nextData.find(item => item.trialid === trialid)
    activeItem.status = activeItem.status ? null : true
    PalmService.editPalm(confirmationData).then(
      data => {
        setTableData(nextData)
        setConfirmationModal(false)
        setSuccessMessage(active)
        setSuccessData(confirmationData)
      },
      error => {
        setErrorMessage(active)
        setErrorData(error.message)
      }
    )
  }

  function ActionButtons({ data }) {
    switch (active) {
      case "estate":
        return (
          <span>
            <img
              src={OpenNew}
              alt=""
              onClick={() =>
                handleActionExpand(["Estate", `Estate ${data.estate}`], {
                  type: "add",
                  estate: data.estate
                })
              }
            />
          </span>
        )
      case "trial":
        return (
          <FlexboxGrid className="spaceBetweenThree" justify="space-between">
            <FlexboxGrid.Item>
              <img
                src={OpenNew}
                alt=""
                onClick={() =>
                  handleActionExpand(
                    [
                      "Trial and Replicate",
                      `Trial ${data.trialid}/Estate ${data.estate}`
                    ],
                    {
                      trial: data.trialid,
                      estate: data.estate,
                      type: "expand"
                    }
                  )
                }
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {data.isEditable ? (
                <img
                  src={CreateIcon}
                  alt=""
                  onClick={() =>
                    handleActionExpand(
                      ["Trial and Replicate", `Edit Trial and Replicate`],
                      {
                        trial: data.trialid,
                        estate: data.estate,
                        type: "edit"
                      }
                    )
                  }
                />
              ) : (
                <Whisper placement="top" trigger="click" speaker={editProgeny}>
                  <img src={CreateIcon} style={{ opacity: 0.2 }} />
                </Whisper>
              )}
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {data.isEditable ? (
                <img
                  src={LinkIcon}
                  onClick={() =>
                    handleActionExpand(
                      ["Trial and Replicate", `Attach Progenies`],
                      {
                        trial: data.trialid,
                        estate: data.estate,
                        type: "attach"
                      }
                    )
                  }
                />
              ) : (
                <Whisper
                  placement="top"
                  trigger="click"
                  speaker={attachProgeny}
                >
                  <img src={LinkIcon} style={{ opacity: 0.2 }} />
                </Whisper>
              )}
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )

      case "plot":
        return (
          <>
            {data.status ? (
              <FlexboxGrid className="spaceBetweenTwo" justify="space-between">
                <FlexboxGrid.Item>
                  <IconButton
                    circle
                    color="green"
                    size="xs"
                    icon={<Icon icon="check" />}
                    onClick={() => openConfirmationModal(data)}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <IconButton
                    circle
                    color="red"
                    size="xs"
                    icon={<Icon icon="close" />}
                    onClick={() => handlePlotEditStatus()}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : (
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                  <img
                    src={QrCodeScanner}
                    alt=""
                    onClick={() =>
                      handleActionExpand(["Plot", "Generate QR Code"], {
                        type: "generate QR",
                        trialid: data.trialid,
                        plot: data.plot
                      })
                    }
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <img
                    src={CreateIcon}
                    alt=""
                    onClick={() => handlePlotEditStatus(data.trialid)}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <img
                    src={LinkIcon}
                    alt=""
                    onClick={() =>
                      handleActionExpand(["Plot", "Edit Palms Information"], {
                        type: "edit",
                        trialid: data.trialid,
                        estate: data.estate,
                        replicate: data.replicate,
                        plot: data.plot
                      })
                    }
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            )}
          </>
        )

      case "palm":
        return (
          <>
            {data.status ? (
              <FlexboxGrid className="spaceBetweenTwo" justify="space-between">
                <FlexboxGrid.Item>
                  <IconButton
                    circle
                    color="green"
                    size="xs"
                    icon={<Icon icon="check" />}
                    onClick={() => openConfirmationModal(data)}
                  />
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  <IconButton
                    circle
                    color="red"
                    size="xs"
                    icon={<Icon icon="close" />}
                    onClick={() => cancelPalmData(data.trialid)}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : (
              <img
                src={CreateIcon}
                alt=""
                onClick={() => handlePalmEditStatus(data.trialid)}
              />
            )}
          </>
        )

      case "progeny":
        return (
          <span>
            <img
              src={CreateIcon}
              alt=""
              onClick={() =>
                handleActionExpand(["Progeny", "Edit Progeny"], {
                  type: "edit",
                  progenyId: data.progenyId,
                  popvar: data.popvar,
                  origin: data.origin,
                  progenyremark: data.progenyremark,
                  progeny: data.progeny,
                  generation: data.generation,
                  ortet: data.ortet,
                  fp: data.fp,
                  fpVar: data.fpVar,
                  fpFam: data.fpFam,
                  mp: data.mp,
                  mpFam: data.mpFam,
                  mpVar: data.mpVar,
                  cross: data.cross,
                  crossType: data.crossType
                })
              }
            />
          </span>
        )
      case "userlist":
        return (
          <span>
            <img
              src={CreateIcon}
              alt=""
              onClick={() =>
                handleActionExpand(["User List", "Edit User"], {
                  userId: data.userId,
                  username: data.username,
                  position: data.position,
                  status: data.status
                })
              }
            />
          </span>
        )
      case "estateAssignment":
        function openAssignUserModal(data) {
          setAssignUserModal(true)
          setEstate(data)
        }

        return (
          <FlexboxGrid className="spaceBetweenTwo" justify="space-between">
            <FlexboxGrid.Item>
              <img
                src={OpenNew}
                alt=""
                onClick={() =>
                  handleActionExpand(
                    ["Estate Assignment", `Estate ${data.estate}`],
                    {
                      type: "check",
                      estate: data.estate
                    }
                  )
                }
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <img
                src={AccountCircle}
                alt=""
                onClick={() => openAssignUserModal(data.estate)}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        )
      case "userAssignment":
        return (
          <span>
            <img
              src={AccountCircle}
              alt=""
              onClick={() => openAssignEstateModal(data.username)}
            />
          </span>
        )
      default:
        return null
    }
  }

  const assignUserToEstate = () => {
    const payload = {
      estate: estate,
      userId: selectedItem
    }
    UserService.assignUserToEstate(payload).then(
      data => {
        console.log(payload, " successfully transfer to backend")
        setSuccessMessage(active)
        setAssignUserModal(false)
      },
      error => {
        console.log(payload, " was not successfully transfer to backend.")
      }
    )
  }

  const assignEstateToUser = () => {
    const payload = {
      username: username,
      estate: selectedItem
    }
    UserService.assignEstateToUser(payload).then(
      data => {
        console.log(payload, " successfully transfer to backend")
        setSuccessMessage(active)
        setAssignEstateModal(false)
      },
      error => {
        console.log(payload, " was not successfully transfer to backend.")
      }
    )
  }

  function handleActionExpand(breadcrumb, option) {
    dispatch(setBreadcrumb({ breadcrumb, option }))
  }

  function openAssignEstateModal(data) {
    setAssignEstateModal(true)
    setUsername(data)
  }

  function handleAddNewTrial(breadcrumb, option) {
    console.log({ breadcrumb }, { option })
    dispatch(setBreadcrumb({ breadcrumb, option }))
  }

  function onDelete() {
    console.log("checkStatus", checkStatus)
    const rows = tableData.filter((r, i) => checkStatus.includes(i))
    console.log("row", rows)
    setRowsToDelete(rows)
    setDeleteModal(true)
  }

  function handleDeleteRecords() {
    console.log(rowsToDelete)
    setTimeout(() => {
      // Deleted successfully
      // Close the modal
      setDeleteModal(false)
      //Display success message
      setSuccessMessage(active)
    }, 500)
  }

  function SuccessMessage({ activeNav, successData }) {
    console.log({ activeNav })
    switch (activeNav) {
      case "estate":
        return (
          <>
            {rowsToDelete.length < 2 ? (
              <Message
                showIcon
                type="success"
                description={`Estate ${rowsToDelete[0].estate} has been successfuly been deleted.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            ) : (
              <Message
                showIcon
                type="success"
                description={`${rowsToDelete.length} Estates  has been successfuly been deleted.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            )}
          </>
        )
      case "trial":
        return (
          <>
            {rowsToDelete.length < 2 ? (
              <Message
                showIcon
                type="success"
                description={`Trial ${rowsToDelete[0].trialid} has been successfuly been deleted.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            ) : (
              <Message
                showIcon
                type="success"
                description={`${rowsToDelete.length} Trials  has been successfuly been deleted.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            )}
          </>
        )
      case "plot":
        if (successData !== null) {
          return (
            <>
              <Message
                showIcon
                type="success"
                description={`${successData.plot} for
                            Replicate ${successData.replicate} for 
                            Trial ${successData.trialid} has been successfully edited.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            </>
          )
        } else if (successData === null) {
          return <></>
        } else {
          return (
            <>
              {rowsToDelete.length < 2 ? (
                <Message
                  showIcon
                  type="success"
                  description={`${rowsToDelete[0].plot} in replicate ${rowsToDelete[0].replicate} at trial ${rowsToDelete[0].trialid} has been successfuly been deleted.`}
                  onClick={() => {
                    setSuccessMessage("")
                  }}
                />
              ) : (
                <Message
                  showIcon
                  type="success"
                  description={`${rowsToDelete.length} Plots in their replicates at
                the trial has been successfuly been deleted.`}
                  onClick={() => {
                    setSuccessMessage("")
                  }}
                />
              )}
            </>
          )
        }
      case "palm":
        if (successData !== null) {
          return (
            <>
              <Message
                showIcon
                type="success"
                description={`Palm ${successData.palmno} in 
                                ${successData.plot} in 
                                Replicate ${successData.replicate} in 
                                Trial ${successData.trialid} has been successfully edited.`}
                onClick={() => {
                  setSuccessMessage("")
                }}
              />
            </>
          )
        } else if (successData === null) {
          return <></>
        }
      case "progeny":
        if (successData === null) {
          return (
            <>
              {rowsToDelete.length < 2 ? (
                <Message
                  showIcon
                  type="success"
                  description={`Progeny ${rowsToDelete[0].progenyId} has been successfuly been deleted.`}
                  onClick={() => {
                    setSuccessMessage("")
                  }}
                />
              ) : (
                <Message
                  showIcon
                  type="success"
                  description={`${rowsToDelete.length} Progenies  has been successfuly been deleted.`}
                  onClick={() => {
                    setSuccessMessage("")
                  }}
                />
              )}
            </>
          )
        } else if (successData.type === "PROGENY_ADD") {
          return (
            <Message
              showIcon
              type="success"
              description={`Progeny ${successData.data.progenyId} has been successfuly been added.`}
              onClick={() => {
                setSuccessMessage("")
              }}
            />
          )
        } else if (successData.type === "PROGENY_EDIT") {
          return (
            <Message
              showIcon
              type="success"
              description={`Progeny ${successData.data.progenyId} has been successfuly been edited.`}
              onClick={() => {
                setSuccessMessage("")
              }}
            />
          )
        }
      case "userlist":
        return (
          <>
            <Message
              showIcon
              type="success"
              description="{`has been added to the system.`}"
              onClick={() => {
                setSuccessMessage("")
              }}
            />
          </>
        )
      case "estateAssignment":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Users have been assigned to the estate.`}
              onClick={() => {
                setSuccessMessage("")
              }}
            />
          </>
        )
      case "userAssignment":
        return (
          <>
            <Message
              showIcon
              type="success"
              description={`Estate have been assigned to the users.`}
              onClick={() => {
                setSuccessMessage("")
              }}
            />
          </>
        )
      default:
        return <></>
    }
  }

  function ErrorMessage({ activeNav, errorData }) {
    switch (activeNav && errorData) {
      case "plot" && errorData !== undefined:
        return (
          <>
            <Message
              showIcon
              type="error"
              description={`${errorData} is the problem unable to edit plot`}
              onClick={() => {
                setErrorMessage("")
              }}
            />
          </>
        )
      case "palm" && errorData !== undefined:
        return (
          <>
            <Message
              showIcon
              type="error"
              description={`${errorData} is the problem unable to edit palm.`}
              onClick={() => {
                setErrorMessage("")
              }}
            />
          </>
        )
      default:
        return <></>
    }
  }

  function reArrangeTableFields() {
    switch (active) {
      case "estate":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "estate") {
            //field.width = 320
            field.flexGrow = 1
            currentTableDataFields[0] = field
          }
          if (field.value === "estatefullname") {
            //field.width = 320
            field.flexGrow = 1
            currentTableDataFields[1] = field
          }
          if (field.value === "noofestateblock") {
            //field.width = 320
            field.flexGrow = 1
            currentTableDataFields[2] = field
          }
          if (field.value === "nooftrails") {
            //field.width = 320
            field.flexGrow = 1
            currentTableDataFields[3] = field
          }
        })
        return currentTableDataFields

      case "trial":
        const trialfields = []
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialid") {
            field.width = 120
            trialfields[0] = field
          }
          if (field.value === "trial") {
            field.width = 200
            trialfields[1] = field
          }
          if (field.value === "trialremark") {
            field.width = 500
            trialfields[2] = field
          }
          if (field.value === "area") {
            field.width = 120
            trialfields[3] = field
          }
          if (field.value === "planteddate") {
            field.width = 120
            trialfields[4] = field
          }
          if (field.value === "nofprogeny") {
            field.width = 120
            trialfields[5] = field
          }
          if (field.value === "estate") {
            field.width = 120
            trialfields[6] = field
          }
          if (field.value === "nofreplicate") {
            field.width = 140
            trialfields[7] = field
          }
          // if (field.value === "soiltype") {
          //   field.width = 120
          //   trialfields[8] = field
          // }
          if (field.value === "nofplot") {
            field.width = 120
            trialfields[9] = field
          }
          if (field.value === "nofplot_subblock") {
            field.width = 170
            trialfields[10] = field
          }
          if (field.value === "nofsubblock") {
            field.width = 170
            trialfields[11] = field
          }
          if (field.value === "status") {
            field.width = 130
            trialfields[12] = field
          }
        })
        return trialfields

      case "plot":
        const plotfields = []
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialid") {
            field.width = 140
            plotfields[0] = field
          }
          if (field.value === "estate") {
            field.width = 140
            plotfields[1] = field
          }
          if (field.value === "replicate") {
            field.width = 140
            plotfields[2] = field
          }
          if (field.value === "estateblock") {
            field.width = 140
            plotfields[3] = field
          }
          if (field.value === "design") {
            field.width = 140
            plotfields[4] = field
          }
          if (field.value === "density") {
            field.width = 140
            plotfields[5] = field
          }
          if (field.value === "plot") {
            field.width = 140
            plotfields[6] = field
          }
          if (field.value === "subblock") {
            field.width = 140
            plotfields[7] = field
          }
          if (field.value === "progenyId") {
            field.width = 140
            plotfields[8] = field
          }
          if (field.value === "progeny") {
            field.width = 140
            plotfields[9] = field
          }
          if (field.value === "ortet") {
            field.width = 140
            plotfields[10] = field
          }
          if (field.value === "fp") {
            field.width = 140
            plotfields[11] = field
          }
          if (field.value === "mp") {
            field.width = 140
            plotfields[12] = field
          }
          if (field.value === "noofPalm") {
            field.width = 140
            plotfields[13] = field
          }
        })
        return plotfields

      case "palm":
        const palmfields = []
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialid") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[0] = field
          }
          if (field.value === "estate") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[1] = field
          }
          if (field.value === "replicate") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[2] = field
          }
          if (field.value === "estateblock") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[3] = field
          }
          if (field.value === "plot") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[4] = field
          }
          if (field.value === "palmno") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[5] = field
          }
          if (field.value === "palmname") {
            //field.width = 200
            field.flexGrow = 1
            palmfields[6] = field
          }
        })
        return palmfields

      case "progeny":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "progenyId") {
            field.width = 150
            currentTableDataFields[0] = field
          }
          if (field.value === "popvar") {
            field.width = 120
            currentTableDataFields[1] = field
          }
          if (field.value === "origin") {
            field.width = 150
            currentTableDataFields[2] = field
          }
          if (field.value === "progenyremark") {
            field.width = 150
            currentTableDataFields[3] = field
          }
          if (field.value === "progeny") {
            field.width = 100
            currentTableDataFields[4] = field
          }
          if (field.value === "generation") {
            field.width = 120
            currentTableDataFields[5] = field
          }
          if (field.value === "ortet") {
            field.width = 120
            currentTableDataFields[6] = field
          }
          if (field.value === "fp") {
            field.width = 100
            currentTableDataFields[7] = field
          }
          if (field.value === "fpFam") {
            field.width = 100
            currentTableDataFields[8] = field
          }
          if (field.value === "fpVar") {
            field.width = 100
            currentTableDataFields[9] = field
          }
          if (field.value === "mp") {
            field.width = 100
            currentTableDataFields[10] = field
          }
          if (field.value === "mpFam") {
            field.width = 100
            currentTableDataFields[11] = field
          }
          if (field.value === "mpVar") {
            field.width = 100
            currentTableDataFields[12] = field
          }
          if (field.value === "cross") {
            field.width = 180
            currentTableDataFields[13] = field
          }
          if (field.value === "crossType") {
            field.width = 180
            currentTableDataFields[14] = field
          }
        })
        return currentTableDataFields

      case "userlist":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "userId") {
            field.width = 180
            currentTableDataFields[0] = field
          }
          if (field.value === "username") {
            field.width = 180
            currentTableDataFields[1] = field
          }
          if (field.value === "position") {
            field.width = 1200
            currentTableDataFields[2] = field
          }
          if (field.value === "status") {
            field.width = 130
            currentTableDataFields[3] = field
          }
        })
        return currentTableDataFields

      default:
        return currentTableDataFields
    }
  }

  return (
    <>
      <div>
        <Grid fluid>
          <Row className="show-grid" id="dashboardTableSetting">
            <Col sm={6} md={6} lg={6} className="totalRecordLayout">
              <b>Total records ({tableData.length})</b>
            </Col>

            <FlexboxGrid justify="end">
              <Col sm={5} md={5} lg={5}>
                <FlexboxGrid.Item className="selectPage">
                  <InputPicker
                    className="option"
                    data={perpage}
                    defaultValue={"10"}
                    onChange={handleChangeLength}
                  />{" "}
                  <b className="page">per page</b>
                </FlexboxGrid.Item>
              </Col>

              <AddButton />

              <DeleteButton />
              <DeleteModal
                show={isDeleteModal}
                hide={() => setDeleteModal(false)}
                deleteRecord={handleDeleteRecords}
                activeNav={active}
                rows={rowsToDelete}
              />
              <SuccessMessage
                activeNav={successMessage}
                successData={successData}
              />

              <ErrorMessage activeNav={errorMessage} errorData={errorData} />

              <SuccessModal
                show={isSuccessModal}
                hide={CloseSuccessModal}
                data={successData}
              />
              <AssignUser
                estate={estate}
                selectedItem={selectedItem}
                show={assignUserModal}
                hide={() => setAssignUserModal(false)}
                setSelectedItem={setSelectedItem}
                assignUserToEstate={assignUserToEstate}
              />

              <AssignEstate
                username={username}
                selectedItem={selectedItem}
                show={assignEstateModal}
                hide={() => setAssignEstateModal(false)}
                setSelectedItem={setSelectedItem}
                assignEstateToUser={assignEstateToUser}
              />

              <ConfirmationModal
                show={confirmationModal}
                hide={closeConfirmationModal}
                data={confirmationData}
                savePlotData={savePlotData}
                savePalmData={savePalmData}
                currentPage={active}
              />
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table
          id="dashboardTable"
          wordWrap
          data={getData(displaylength)}
          autoHeight
        >
          {active === "progeny" ? (
            <Column width={70} align="center" fixed>
              <HeaderCell className="tableHeader">
                <Checkbox
                  checked={checked}
                  indeterminate={indeterminate}
                  onChange={handleCheckAll}
                />
              </HeaderCell>
              <CheckCell
                dataKey="rowNumber"
                checkedKeys={checkStatus}
                onChange={handleCheck}
              />
            </Column>
          ) : null}
          {reArrangeTableFields().map((field, i) =>
            field.value === "status" ? (
              <Column
                width={field.width ? field.width : null}
                flexGrow={field.flexGrow ? field.flexGrow : null}
                align="center"
                key={i}
                fixed="right"
              >
                <HeaderCell className="tableHeader">{field.label}</HeaderCell>
                <Cell align="center">
                  {rowData => {
                    return <StatusButton status={rowData.status} />
                  }}
                </Cell>
              </Column>
            ) : (
              <Column
                width={field.width ? field.width : null}
                flexGrow={field.flexGrow ? field.flexGrow : null}
                align="left"
                key={i}
              >
                <HeaderCell className="tableHeader">{field.label}</HeaderCell>
                {active === "plot" || active === "palm" ? (
                  <EditableCell
                    dataKey={field.value}
                    dashboardData={dashboardData}
                    handlePalmEditChange={handlePalmEditChange}
                    handlePlotEditChange={handlePlotEditChange}
                    active={active}
                  />
                ) : (
                  <Cell dataKey={field.value} />
                )}
              </Column>
            )
          )}

          <Column width={130} align="center" fixed="right">
            <HeaderCell className="tableHeader">Action</HeaderCell>
            <Cell align="center" {...props}>
              {rowData => <ActionButtons data={rowData} />}
            </Cell>
          </Column>
        </Table>

        <div className="pagination">
          <Pagination
            {...pagination}
            pages={getNoPages()}
            maxButtons={2}
            activePage={activePage}
            onSelect={handleChangePage}
          />
        </div>
      </div>
    </>
  )
}

export default DataTable
