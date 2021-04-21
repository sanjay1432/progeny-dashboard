import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { ACTION, CANCEL_REQUEST, MODULE } from "../../../constants/index"
import { Alert } from "rsuite"
import axios from "axios"
import { Icon, Table, IconButton } from "rsuite"
import ConfigPanel from "../ConfigPanel"
import ThresholdService from "../../../services/threshold.service"
import AddProcessLineThresholdDialog from "./process-line/AddProcessLineThresholdDialog"
import EditProcessLineThresholdDialog from "./process-line/EditProcessLineThresholdDialog"
import GeneralHelper from "../../../helper/general.helper"
import { useAbility } from "@casl/react"
import { AbilityContext } from "../../../config/Can"
import { ModuleAbility } from "../../../models/ModuleAbility"
const { Cell } = Table

const ProcessLineTargetPanel = () => {
  const [tableData, setTableData] = useState([])
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const mill = useSelector(state => state.appReducer.mill)
  const processLines = useSelector(state => state.dashboardReducer.processLines)
  const ability = useAbility(AbilityContext)
  const [moduleAbility, setModuleAbility] = useState(null)

  useEffect(() => {
    setModuleAbility(
      new ModuleAbility(MODULE.threshold, mill.millId, mill.buId)
    )
  }, [mill])

  const ActionCell = ({ rowData, dataKey, ...props }) => {
    return (
      <Cell {...props} className="__action_col">
        <div className="d-flex justify-content-space-center align-items-center">
          {moduleAbility !== null && ability.can(ACTION.modify, moduleAbility) && (
            <IconButton
              onClick={() => editConfig(rowData)}
              size="sm"
              className="mr-2"
              icon={<Icon icon="pencil" />}
              placement="left"
            >
              Edit
            </IconButton>
          )}
        </div>
      </Cell>
    )
  }

  const ProcessLineCell = ({ rowData, dataKey, ...props }) => {
    return <Cell {...props}>{rowData[dataKey].processLineName}</Cell>
  }

  const DateCell = ({ rowData, dataKey, ...props }) =>
    GeneralHelper.DateCell({ rowData, dataKey, ...props })
  const COLUMNS = [
    {
      name: "No.",
      dataKey: "no",
      width: 70,
      resizable: true,
      sortable: true
    },
    {
      name: "Business Unit",
      dataKey: "bu",
      resizable: true,
      customCell: GeneralHelper.BuCell,
      sortable: true
    },
    {
      name: "Process Line",
      dataKey: "processLine",
      customCell: ProcessLineCell,
      resizable: true,
      sortable: true
    },
    {
      name: "Threshold",
      dataKey: "threshold",
      sortable: true,
      resizable: true
    },
    {
      name: "Maximum",
      dataKey: "maximum",
      sortable: true,
      resizable: true
    },
    {
      name: "Start Date",
      dataKey: "startDate",
      sortable: true,
      resizable: true,
      customCell: DateCell
    },
    {
      name: "End Date",
      dataKey: "endDate",
      sortable: true,
      resizable: true,
      customCell: DateCell
    },
    {
      name: "Action",
      dataKey: "action",
      customCell: ActionCell,
      fixed: "right"
    }
  ]

  const editConfig = rowData => {
    if (rowData) {
      setShowEditDialog(true)
      setSelectedRow(rowData)
    }
  }

  const submitEditConfig = () => {
    setShowEditDialog(false)
    getConfig(mill, setTableData)
  }

  const cancelEditConfig = () => {
    setShowEditDialog(false)
  }

  const deleteConfig = () => {
    setShowEditDialog(false)
    getConfig(mill, setTableData)
  }

  const submitAddConfig = () => {
    setShowAddDialog(false)
    getConfig(mill, setTableData)
  }

  const cancelAddConfig = () => {
    setShowAddDialog(false)
  }

  useEffect(() => {
    getConfig(mill, setTableData)
  }, [mill])

  if (!mill) {
    return ""
  }

  return (
    <>
      <div className="opex-panel-content">
        <ConfigPanel
          columns={COLUMNS}
          data={tableData}
          addConfig={() => setShowAddDialog(true)}
        />
      </div>
      <AddProcessLineThresholdDialog
        processLines={processLines}
        showDialog={showAddDialog}
        submitConfig={submitAddConfig}
        cancelConfig={cancelAddConfig}
      />

      <EditProcessLineThresholdDialog
        processLines={processLines}
        showDialog={showEditDialog}
        submitConfig={submitEditConfig}
        cancelConfig={cancelEditConfig}
        deleteConfig={deleteConfig}
        data={selectedRow}
      />
    </>
  )
}

export default ProcessLineTargetPanel

function getConfig(mill, setTableData) {
  const CancelToken = axios.CancelToken
  const source = CancelToken.source()
  ThresholdService.getProcessLineConfig(
    { buId: mill.buId, millId: mill.millId, kpiId: 1 },
    source
  ).then(
    data => {
      if (data && data.data) {
        const sortedData = GeneralHelper.sortDataByStartDate(data.data)
        setTableData(
          sortedData.map((item, index) => {
            return { no: index + 1, ...item }
          })
        )
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
