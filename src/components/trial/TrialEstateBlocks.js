import React, { useState, useEffect } from "react"
import {
  Table,
  FlexboxGrid,
  Button,
  InputPicker,
  SelectPicker,
  Grid,
  Row,
  Col,
  Pagination,
  ControlLabel,
  Message,
  Modal,
  IconButton,
  Icon,
  Input
} from "rsuite"
import EstateService from "../../services/estate.service"
import TrialService from "../../services/trial.service"
import CreateIcon from "../../assets/img/icons/create_24px.svg"
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

const TrialEstateBlocks = ({
  currentSubNavState,
  currentItem,
  option,
  ...props
}) => {
  const [tableData, setTableData] = useState([])
  const [filteredTableData, setFilteredTableData] = useState([])
  const [ebAdded, setebAdded] = useState(null)
  const [selectedSoilType, setSelectedSoilType] = useState(null)
  const [selectedReplicate, setSelectedReplicate] = useState(null)
  const [pagination, setPagination] = useState(initialState)
  const [show, setShow] = useState(false)
  const [estateBlocks, setEstateBlocks] = useState([])
  const [blocksForEstate, setBlocksForEstate] = useState([])
  const [soilTypeFilterData, setSoilTypeFilterData] = useState([])
  useEffect(() => {
    async function fetchData() {
      // You can await here
      const data = await TrialService.getTrialReplicates(option.trial)
      let replicates = data.replicates
      console.log({ replicates })
      const newSetOfReps = []
      replicates.forEach((reps, idx) => {
        const blocks = reps.estateblocks
        if (blocks.length < 2) {
          reps.estateblock = blocks[0].name
          newSetOfReps.push(reps)
        }
        if (blocks.length > 1) {
          const uni = reps
          delete uni.estateblock
          for (let i = 0; i < blocks.length; i++) {
            reps = {}
            reps["estateblock"] = blocks[i].name
            Object.keys(uni).forEach(key => (reps[key] = uni[key]));
            newSetOfReps.push(reps)
          }
        }
      })
      setTableData([...newSetOfReps])
      console.log({ newSetOfReps })
      replicates = newSetOfReps

      replicates.filter((v, i) => {
        const start = displaylength * (activePage - 1)
        const end = start + displaylength
        return i >= start && i < end
      })

      setFilteredTableData(replicates)

      const soilTypes = [...new Set(replicates.map(row => row.soiltype))]
      const types = []
      for (let type in soilTypes) {
        types.push({
          label: soilTypes[type],
          value: soilTypes[type]
        })
      }

      setSoilTypeFilterData(types)
    }
    fetchData()
    getEstateBlocks()
  }, [])

  async function getEstateBlocks() {
    const { data } = await EstateService.getUpdatedEstateBlocks()
    const ebs = []
    option.estate.forEach(est => {
      const items = data.find(eb => eb.estate === est.name).estateblocks
      ebs.push(...items)
    })

    setBlocksForEstate(ebs)

    const blocks = []
    const map = new Map()
    for (const item of ebs) {
      if (!map.has(item.estateblock)) {
        map.set(item.estateblock, true) // set any value to Map
        blocks.push({
          label: item.estateblock,
          value: item.estateblock
        })
      }
    }
    setEstateBlocks(blocks)
  }
  const { activePage, displaylength } = pagination

  const perpage = [
    {
      label: "5",
      value: "5"
    },
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
    dataKey = parseInt(dataKey)
    setPagination(() => ({
      ...pagination,
      displaylength: dataKey
    }))
    const filterData = tableData.filter((v, i) => {
      const start = dataKey * (activePage - 1)
      const end = start + dataKey
      return i >= start && i < end
    })
    console.log(filterData, dataKey, activePage)
    setFilteredTableData(filterData)
  }

  function getNoPages() {
    const { displaylength } = pagination
    return Math.ceil(tableData.length / displaylength)
  }

  function SuccessMessage() {
    if (ebAdded === true) {
      return (
        <>
          <Message
            showIcon
            type="success"
            description={`Replicate ${selectedReplicate.replicate} for Trial ${option.trial} has been successfully edited`}
            onClick={() => {
              setebAdded(null)
            }}
          />
        </>
      )
    } else if (ebAdded === false) {
      return (
        <>
          <h1>ERROR</h1>
        </>
      )
    } else {
      return <></>
    }
  }
  const handleChange = (idx, key, value) => {
    console.log(estateBlocks)
    const nextData = Object.assign([], filteredTableData)
    nextData.find((item, i) => i === idx)[key] = value
    setFilteredTableData(nextData)
  }

  const handleEditState = (idx, save = false) => {
    const nextData = Object.assign([], filteredTableData)
    const activeItem = nextData.find((item, i) => i === idx)
    activeItem.status = activeItem.status ? null : "EDIT"
    setTableData(nextData)
  }

  function UnderLinedText(props) {
    return (
      <span
        style={{
          fontWeight: "bold",
          textDecorationLine: "underline",
          fontSize: "16px"
        }}
      >
        {props.text}
      </span>
    )
  }

  const EditCell = ({ rowData, rowIndex, dataKey, onChange, ...props }) => {
    const editing = rowData.status === "EDIT"
    return (
      <Cell {...props} className={editing ? "table-content-editing" : ""}>
        {editing && dataKey !== "estateblock" ? (
          <Input
            defaultValue={rowData[dataKey]}
            disabled={["replicate", "design", "soiltype"].includes(dataKey)}
            onChange={(value, event) => {
              onChange && onChange(rowIndex, dataKey, event.target.value)
            }}
          />
        ) : editing && dataKey === "estateblock" ? (
          <SelectPicker
            data={estateBlocks}
            style={{ width: 224 }}
            placeholder="-"
            value={rowData.estateblock}
            onChange={value => {
              onChange && onChange(rowIndex, dataKey, value)
            }}
          />
        ) : (
          <span className="table-content-edit-span">{rowData[dataKey]}</span>
        )}
      </Cell>
    )
  }

  const ActionCell = ({ rowData, rowIndex, dataKey, onClick, ...props }) => {
    return (
      <Cell align="center" {...props}>
        {rowData.status === "EDIT" ? (
          <FlexboxGrid className="spaceBetweenTwo" justify="space-between">
            <FlexboxGrid.Item>
              <IconButton
                icon={<Icon icon="check" />}
                circle
                color="green"
                size="xs"
                onClick={() => {
                  // onClick && onClick(rowData.id)
                  rowData.idx = rowIndex
                  setSelectedReplicate(rowData)
                  setShow(true)
                }}
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              <IconButton
                icon={<Icon icon="close" />}
                circle
                color="red"
                size="xs"
                onClick={() => {
                  onClick && onClick(rowIndex) //handleEditState
                }}
              />
            </FlexboxGrid.Item>
          </FlexboxGrid>
        ) : (
          <span>
            <img
              src={CreateIcon}
              alt=""
              onClick={() => {
                onClick && onClick(rowIndex) //handleEditState
              }}
            />
          </span>
        )}
        {/* </Button> */}
      </Cell>
    )
  }

  function onReset() {
    setSelectedSoilType(null)
    setFilteredTableData(tableData)
  }
  function onApply() {
    console.log(selectedSoilType)
    const filteredData = tableData.filter(
      row => row.soiltype === selectedSoilType
    )
    setFilteredTableData(filteredData)
  }
  async function onSaveReplicate() {
    try {
      handleEditState(selectedReplicate.idx, true)
      console.log({ blocksForEstate })
      console.log(selectedReplicate)

      setShow(false)
      const { estateblock, estate, density, replicateId } = selectedReplicate
      const block = blocksForEstate.find(b => b.estateblock === estateblock)
      const payload = {
        blockId: block.id,
        estate,
        density,
        replicateId,
        trialId: option.trial
      }
      await TrialService.updateTrialReplicate(payload)
      setebAdded(true)
    } catch (err) {
      setebAdded(false)
      console.log(err)
    }
  }
  return (
    <>
      <div>
        <Grid fluid id="dashboardFilterPanel" className="modifyPadding">
          <Row className="show-grid">
            <Col sm={6} md={4} lg={3}>
              <ControlLabel className="labelFilter">Soil Type</ControlLabel>
              <br />
              <SelectPicker
                className="dashboardSelectFilter"
                data={soilTypeFilterData}
                value={selectedSoilType}
                onChange={(value, e) => setSelectedSoilType(value)}
                style={{ width: 180 }}
              />
            </Col>
            <Col sm={5} md={4} lg={3}>
              <div className="show-col">
                <Button
                  className="applyButton"
                  appearance="primary"
                  onClick={onApply}
                >
                  Apply
                </Button>
              </div>
            </Col>

            <Col sm={3} md={4} lg={3}>
              <div className="show-col">
                <Button
                  className="resetButton"
                  appearance="subtle"
                  onClick={onReset}
                >
                  Reset Filter
                </Button>
              </div>
            </Col>
          </Row>
          <Row className="show-grid" id="dashboardTableSetting">
            <Col sm={6} md={6} lg={6} className="totalRecordLayout">
              <b>Total records ({tableData ? tableData.length : null})</b>
            </Col>

            <FlexboxGrid justify="end">
              <Col sm={5} md={5} lg={4}>
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
            </FlexboxGrid>
          </Row>
        </Grid>

        <Table wordWrap data={filteredTableData} autoHeight id="dashboardTable">
          <Column width={200}>
            <HeaderCell className="tableHeader">Replicate</HeaderCell>
            <EditCell dataKey="replicate" onChange={handleChange} />
          </Column>

          <Column width={200}>
            <HeaderCell className="tableHeader">Estate Block</HeaderCell>
            <EditCell dataKey="estateblock" onChange={handleChange} />
          </Column>

          <Column width={250}>
            <HeaderCell className="tableHeader">Density</HeaderCell>
            <EditCell dataKey="density" onChange={handleChange} />
          </Column>

          <Column width={250}>
            <HeaderCell className="tableHeader">Design</HeaderCell>
            <EditCell dataKey="design" onChange={handleChange} />
          </Column>

          <Column width={250}>
            <HeaderCell className="tableHeader">Soil Type</HeaderCell>
            <EditCell dataKey="soiltype" onChange={handleChange} />
          </Column>

          <Column width={130} fixed="right">
            <HeaderCell className="tableHeader" align="center">
              Action
            </HeaderCell>
            <ActionCell dataKey="id" onClick={handleEditState} />
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

        {/* EDIT CONFIRMATION MODEL START */}
        <Modal id="SaveTrialModal" show={show} onHide={() => setShow(false)}>
          <Modal.Header>
            <Modal.Title className="title">Edit Replicate</Modal.Title>
          </Modal.Header>
          <Modal.Body className="body">
            Are you sure to edit{" "}
            <UnderLinedText
              text={`Replicate ${selectedReplicate?.replicate}`}
            />{" "}
            for <UnderLinedText text={`Trial  ${option.trial}`} /> &nbsp; from
            the list? This might change data that is associate with it as well!
          </Modal.Body>
          <Modal.Footer>
            <Button
              onClick={() => setShow(false)}
              className="yesButton"
              appearance="subtle"
            >
              No
            </Button>
            <Button
              onClick={onSaveReplicate}
              className="noButton"
              appearance="primary"
            >
              Yes
            </Button>
          </Modal.Footer>
        </Modal>
        {/* EDIT CONFIRMATION MODEL END */}

        <SuccessMessage />
      </div>
    </>
  )
}

export default TrialEstateBlocks
