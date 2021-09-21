import React, { useState, useEffect } from "react";
import {
  Modal,
  Table,
  Button,
  Checkbox,
  Grid,
  Row,
  Col,
  ControlLabel,
  SelectPicker,
  IconButton,
  Icon,
} from "rsuite";
import { useDispatch, useSelector } from "react-redux"
import { getDashboardData } from "../../redux/actions/dashboarddata.action"
import DashboardDataService from "../../services/dashboarddata.service";
import EstateService from "../../services/estate.service";
const { Column, HeaderCell, Cell } = Table;

const rowKey = "estateId";
const ExpandCell = ({
  rowData,
  dataKey,
  expandedRowKeys,
  onChange,
  ...props
}) => (
  <Cell {...props}>
    <IconButton
      size="lg"
      appearance="subtle"
      onClick={() => {
        onChange(rowData);
      }}
      icon={
        <Icon
          icon={
            expandedRowKeys === rowData[rowKey] ? "minus-circle" : "plus-circle"
          }
          style={
            expandedRowKeys === rowData[rowKey] ? { color: "#f44336" } : {}
          }
        />
      }
    />
  </Cell>
);

const MapEstates = ({
  show,
  hide,
  currentSubNavState,
  currentItem,
  ...props
}) => {
  const dispatch = useDispatch()
  const [reset, setReset] = useState(false);
  const [updateDate, setUpdateDate] = useState(null);
  const [estatesList, setEstates] = useState([]);
  const [estateFilterData, setEstateFilterData] = useState([]);
  const [checkStatusEstate, setCheckStatusEstate] = useState([]);
  const [expandedRowKeys, setExpandedRowKeys] = useState(null);
  const [checkStatusEstateBlock, setCheckStatusEstateBlock] = useState([]);
  const [selectedEstate, setSelectedEstate] = useState(null);
  const [estateToUpdate, setEstateToUpdate] = useState([]);
  const [rowExpandedHeight, setRowExpandedHeight] = useState(200);
  const { user } = useSelector((state) => state.authReducer);
  useEffect(async () => {
    const { data, updatedDate } =
      await DashboardDataService.getUpdatedEstateBlocks();
    const arrayUniqueByKey = [
      ...new Map(data.map((item) => [item["estateId"], item])).values(),
    ];
    setEstates(arrayUniqueByKey);
    setUpdateDate(updatedDate);
    const estates = [...new Set(data.map((row) => row.estate))];
    const types = [];
    for (let estate in estates) {
      types.push({
        label: estates[estate],
        value: estates[estate],
      });
    }

    setEstateFilterData(types);

    // CHECK IF ALL ESTATE BLOCKS ARE ASSIGNED TO THE ESTATE
    data.forEach((estate) => {
      const assignedBlocks = estate.estateblocks.filter((eb) => eb.assigned);
      if (assignedBlocks.length === estate.estateblocks.length) {
        console.log("FILLED ESTATE:", estate.estateId);
        setCheckStatusEstate([estate.estateId]);
      }
    });
  }, [reset]);

  function onApply() {
    console.log(selectedEstate);

    const filteredData = estatesList.filter(
      (row) => row.estate === selectedEstate
    );
    setEstates(filteredData);
  }

  async function onReset() {
    setExpandedRowKeys(null)
    setSelectedEstate(null);
    setEstateToUpdate([]);
    setReset(!reset)
  }

  function handleExpanded(rowData, dataKey) {
    let open = false;
    let nextExpandedRowKeys = null;

    if (expandedRowKeys === rowData[rowKey]) {
      open = true;
    } else {
      nextExpandedRowKeys = expandedRowKeys;
    }

    if (!open) {
      nextExpandedRowKeys = rowData[rowKey];
    }
    setExpandedRowKeys(nextExpandedRowKeys);
    const keys = rowData.estateblocks.map((eb) =>
      eb.assigned ? eb.estateblock : null
    );

    setCheckStatusEstateBlock(keys.filter((key) => key));
  }
  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
         disabled
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  );

  const ExpandedRowCheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
        //  disabled
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  );

  let estatechecked = false;
  let estateindeterminate = false;

  if (checkStatusEstate.length === estateFilterData.length) {
    estatechecked = true;
  } else if (checkStatusEstate.length === 0) {
    estatechecked = false;
  } else if (
    checkStatusEstate.length > 0 &&
    checkStatusEstate.length < estateFilterData.length
  ) {
    estateindeterminate = true;
  }

  const handleCheckAllEstate = (value, checked) => {
    const keys = checked ? estatesList.map((item) => item.estateId) : [];
    setCheckStatusEstate(keys);
  };
  const handleCheckEstate = (value, checked) => {
    const keys = checked
      ? [...checkStatusEstate, value]
      : checkStatusEstate.filter((item) => item !== value);
    console.log({ keys });
    setCheckStatusEstate(keys);
  };

  const handleCheckEstateBlocks = (value, checked) => {
    const keys = checked
      ? [...checkStatusEstateBlock, value]
      : checkStatusEstateBlock.filter((item) => item !== value);
    console.log("handleCheckEstateBlocks", {
      expandedRowKeys,
      keys,
      estatesList,
    });
    updateEstateList(estatesList, expandedRowKeys, keys);
    const totalEbs = estatesList.find((e) => e.estateId === expandedRowKeys)
      .estateblocks.length;
    if (keys.length === totalEbs) {
      const estateKeys = [...checkStatusEstate];
      estateKeys.push(expandedRowKeys);
      setCheckStatusEstate(estateKeys);
    } else {
      const estateKeys = [...checkStatusEstate];
      const index = estateKeys.indexOf(expandedRowKeys);
      if (index > -1) {
        estateKeys.splice(index, 1);
      }
      setCheckStatusEstate(estateKeys);
    }

    setCheckStatusEstateBlock(keys);
  };
  function updateEstateList(estates, estateId, estateBlockIds) {
    const estateToUp = [];
    estates.forEach((estate) => {
      if (estate.estateId === estateId) {
        estate.estateblocks.forEach((eb) => {
          if (estateBlockIds.includes(eb.estateblock)) {
            eb.assigned = true;
          } else {
            eb.assigned = false;
          }
        });

        delete estate.createdBy;
        delete estate.createdDate;
        delete estate.updatedBy;
        delete estate.updatedDate;
        estate['updatedBy'] =  user.username
        estateToUp.push(estate);
      }
    });

    setEstateToUpdate((oldArray) => [...oldArray, ...estateToUp]);
  }

  function mapEstate() {
    console.log({ estateToUpdate });
    const message =
      estateToUpdate.length > 1
        ? `${estateToUpdate.length}  Estates has been mapped to the system`
        : `Estate ${estateToUpdate[0].estate} has been mapped to the system`;
    EstateService.assignEstateBlocksToEstate(estateToUpdate).then(
      (data) => {
        dispatch(getDashboardData('estate'))
        hide(message);
      },
      (err) => {
        console.log("Error", err);
      }
    );
  }
  return (
    <Modal id="addEstate" size="sm" show={show} onHide={hide}>
      <Modal.Header>
        <Modal.Title>
          <div>
            <b className="title">Map Estate</b> <br />
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <p className="lastUpdate">
            Last updated on :{" "}
            <b>
              {new Date(updateDate).toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </b>
          </p>
        </div>

        <Grid fluid id="mapEstateFilterPanel">
          <Row className="show-grid">
            <Col sm={6} md={4} lg={3} className="dashboardFilterLayout">
              <ControlLabel className="labelFilter">Estate</ControlLabel>
              <br />
              <SelectPicker
                className="dashboardSelectFilter"
                data={estateFilterData}
                value={selectedEstate}
                style={{ width: 180 }}
                onChange={(value, e) => setSelectedEstate(value)}
              />
            </Col>
            <Col
              sm={5}
              md={4}
              lg={3}
              className="applyButtonLayout"
              style={{ minWidth: "165px" }}
            >
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

            <Col sm={3} md={4} lg={3} className="resetButtonLayout">
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
        </Grid>

        <p>List of Estates ({estateFilterData.length})</p>

        <Table
          wordWrap
          height={400}
          data={estatesList}
          autoHeight
          rowKey={rowKey}
          expandedRowKeys={[expandedRowKeys]}
          rowExpandedHeight={rowExpandedHeight}
          renderRowExpanded={(rowData) => {
            setRowExpandedHeight(rowData.estateblocks.length*50)
            return (
              <div style = {{
                border: "solid green 1px",
                borderRadius: "5px",
                marginTop: "-5px"
              }}>
                <Table
                  showHeader={false}
                  data={rowData.estateblocks}
                  id="modalEstateTable"
                  autoHeight
                >
                  <Column width={80}>
                    <HeaderCell></HeaderCell>
                    <ExpandedRowCheckCell
                      dataKey="estateblock"
                      checkedKeys={checkStatusEstateBlock}
                      onChange={handleCheckEstateBlocks}
                    />
                  </Column>

                  <Column flexGrow={1} align="left">
                    <HeaderCell className="tableHeader"></HeaderCell>
                    <Cell dataKey="estateblock" />
                  </Column>
                </Table>
              </div>
            );
          }}
        >
          <Column width={80}>
            <HeaderCell>
              <Checkbox
              disabled
                checked={estatechecked}
                indeterminate={estateindeterminate}
                onChange={handleCheckAllEstate}
              />
            </HeaderCell>
            <CheckCell
              dataKey="estateId"
              checkedKeys={checkStatusEstate}
              onChange={handleCheckEstate}
            />
          </Column>

          <Column flexGrow={1} align="left">
            <HeaderCell className="tableHeader">Estate</HeaderCell>
            <Cell dataKey="estate" />
          </Column>

          <Column width={70} align="center">
            <HeaderCell>Action</HeaderCell>
            <ExpandCell
              dataKey="estateId"
              expandedRowKeys={expandedRowKeys}
              onChange={handleExpanded}
            />
          </Column>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button className="btnCancel" appearance="ghost" onClick={hide}>
          Cancel
        </Button>
        <Button className="btnAdd" appearance="primary" onClick={mapEstate} disabled = {!estateToUpdate.length}>
          Map Estate
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default MapEstates;
