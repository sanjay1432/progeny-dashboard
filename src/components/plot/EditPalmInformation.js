import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import GeneralHelper from "../../helper/general.helper";
import { clearBreadcrumb } from "../../redux/actions/app.action";
import PlotService from "../../services/plot.service";
import PalmService from "../../services/palm.service"
import { publish, changeActive } from "../../services/pubsub.service";
import ConfirmationModal from "../SharedComponent/ConfirmationModal";
import SuccessMessage from "../SharedComponent/SuccessMessage";
import SearchMessage from "../../assets/img/SearchMessage.svg";
import {
  Table,
  FlexboxGrid,
  Grid,
  Row,
  Col,
  SelectPicker,
  Input,
  ControlLabel,
  Button,
} from "rsuite";

const { Column, HeaderCell, Cell } = Table;

const EditableCell = ({
  rowData,
  dataKey,
  onChange,
  handleEditChange,
  ...cellProps
}) => {
  return (
    <Cell {...cellProps}>
      <Input
        className="editTableInput"
        value={rowData[dataKey]}
        disabled={[
          "trialCode",
          "estate",
          "replicate",
          "estateblock",
          "plot",
        ].includes(dataKey)}
        onChange={(value) =>
          handleEditChange &&
          handleEditChange(
            rowData.trialCode,
            rowData.estate,
            rowData.replicate,
            rowData.plot,
            rowData.palmId,
            dataKey,
            value
          )
        }
      />
    </Cell>
  );
};

const EditPalmInformation = ({ option }) => {
  const initialFilterValue = {
    trialCode: option.trialCode,
    estate: "All",
    replicate: "All",
    plotId: "All",
    trialId: option.trialId,
  };

  const [initialData, setInitialData] = useState([]);
  const [filterValue, setFilterValue] = useState(initialFilterValue);

  const [tableData, setTableData] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  const trialData = useSelector(
    (state) => state.dashboardDataReducer.result.trial
  );
  const [trialIds, setTrialIds] = useState([]);
  const [estates, setEstates] = useState([]);
  const [plots, setPlots] = useState([]);
  const [replicates, setReplicates] = useState([]);
  const [dataToBeEdited, setDataToBeEdited] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (filterValue.trialId) {
      setFilterTrialIds();
      setTrials();
      async function fetchData() {
        const data = await PlotService.getPalmInformation(filterValue.trialId);
        setPlotFilterData(data);
        setReplicateFilterData(data);
        setInitialData(data);
        filterTableData(data);
      }
      fetchData();
    }
  }, [
    filterValue.trialId,
    filterValue.estate,
    filterValue.plotId,
    filterValue.replicate,
  ]);

  const { user } = useSelector((state) => state.authReducer);

  const userInfo = GeneralHelper.buildDisplayName(
    user.firstName,
    user.lastName,
    user.username
  );

  function setTrials() {
    const selectedTrial = trialData.find(
      (trial) => trial.trialCode === filterValue.trialCode
    );
    setTrialEstates(selectedTrial);
  }
  function setFilterTrialIds() {
    const selectorTrialIds = [];
    const trialIdxs = [...new Set(trialData.map((trial) => trial.trialCode))];
    trialIdxs.forEach((id) => {
      selectorTrialIds.push({
        label: id,
        value: id,
      });
    });
    setTrialIds(selectorTrialIds);
  }

  function setTrialEstates(trial) {
    const trialEstate = [];
    const trialEstateBlocks = [];
    trialEstate.push({
      label: "All Estate",
      value: "All",
    });
    trial.estate.forEach((est) => {
      trialEstate.push({
        label: est.name,
        value: est.name,
      });
      for (let i = 0; i < est.estateblocks.length; i++) {
        trialEstateBlocks.push({
          label: `${est.name} - ${est.estateblocks[i].estateblock}`,
          id: est.estateblocks[i].blockId,
          name: est.estateblocks[i].estateblock,
          estate: est.name,
          value: `${est.name} - ${est.estateblocks[i].estateblock}`,
        });
      }
    });

    // SET THE ESTATE BLOCKS WITH ESTATE NAME
    console.log({ trialEstateBlocks });
    setEstates(trialEstate);
  }

  function setPlotFilterData(data) {
    const trialPlots = [];
    trialPlots.push({
      label: "All Plots",
      value: "All",
    });
    const trialPlotIdxs = [...new Set(data.map((plot) => plot.plotId))];
    trialPlotIdxs.forEach((idx) => {
      trialPlots.push({
        label: data.find((plot) => plot.plotId === idx).plot,
        value: idx,
      });
    });
    console.log({ trialPlots });
    setPlots(trialPlots);
  }
  function setReplicateFilterData(data) {
    const trialReplicates = [];
    trialReplicates.push({
      label: "All Replicates",
      value: "All",
    });
    const trialReplicateIdxs = [...new Set(data.map((plot) => plot.replicate))];
    trialReplicateIdxs.forEach((idx) => {
      trialReplicates.push({
        label: idx,
        value: idx,
      });
    });
    console.log({ trialReplicates });
    setReplicates(trialReplicates);
  }
  function setFilterData(value, name) {
    console.log(value, name);
    if (name === "trialCode") {
      const selectedTrial = trialData.find(
        (trial) => trial.trialCode === value
      );
      setTrialEstates(selectedTrial);
      setFilterValue(() => ({ ...filterValue, [name]: value, estate: "All" }));
    } else {
      setFilterValue(() => ({ ...filterValue, [name]: value }));
    }
  }

  function filterTableData(data) {
    const { estate, replicate, plotId } = filterValue;
    const tableInitialData = [...data];

    // IF ALL VALUE IS SELECTED ALL
    if (estate === "All" && replicate === "All" && plotId === "All") {
      setTableData(tableInitialData);
    }
    // IF ALL VALUE IS NOT SELECTED ALL
    if (estate !== "All" && replicate !== "All" && plotId !== "All") {
      const result = tableInitialData.filter(
        (data) =>
          data.estate === filterValue.estate &&
          data.replicate === filterValue.replicate &&
          data.plotId === filterValue.plotId
      );
      setTableData(result);
    }
    // IF  estate === 'All' && (replicate && plotId !== 'All')
    if (estate === "All" && replicate !== "All" && plotId !== "All") {
      const result = tableInitialData.filter(
        (data) =>
          data.replicate === filterValue.replicate &&
          data.plotId === filterValue.plotId
      );
      setTableData(result);
    }
    // IF  replicate === 'All' && (estate && plotId !== 'All')
    if (estate !== "All" && replicate === "All" && plotId !== "All") {
      const result = tableInitialData.filter(
        (data) =>
          data.estate === filterValue.estate &&
          data.plotId === filterValue.plotId
      );
      setTableData(result);
    }
    // IF  plotId === 'All' && (estate && replicate !== 'All')
    if (estate !== "All" && replicate !== "All" && plotId === "All") {
      const result = tableInitialData.filter(
        (data) =>
          data.estate === filterValue.estate &&
          data.replicate === filterValue.replicate
      );
      setTableData(result);
    }
    // IF  estate !== 'All' && (replicate && plotId === 'All')

    if (estate !== "All" && replicate === "All" && plotId === "All") {
      const result = tableInitialData.filter(
        (data) => data.estate === filterValue.estate
      );
      setTableData(result);
    }
    // IF  replicate !== 'All' && (estate && plotId === 'All')

    if (estate === "All" && replicate !== "All" && plotId === "All") {
      const result = tableInitialData.filter(
        (data) => data.replicate === filterValue.replicate
      );
      setTableData(result);
    }
    // IF  plotId !== 'All' && (estate && replicate === 'All')
    if (estate === "All" && replicate === "All" && plotId !== "All") {
      const result = tableInitialData.filter(
        (data) => data.plotId === filterValue.plotId
      );
      setTableData(result);
    }

    console.log(tableData);
  }


  function applyFilter() {
    const selectedTrial = trialData.find(
      (trial) => trial.trialCode === filterValue.trialCode
    );
    setFilterValue({
      ...filterValue,
      replicate: "All",
      plot: "All",
      trialId: selectedTrial.trialId,
    });
  }

  function resetFilter() {
    setFilterValue({
      ...filterValue,
      trialCode: "",
      estate: "",
      replicate: "",
      plot: "",
      trialId: "",
    });
    setTableData([]);
    setEstates([]);
    setPlots([]);
    setReplicates([]);
  }

  const columns = [
    {
      name: "Replicate",
      dataKey: "replicate",
      flexGrow: 1,
    },
    {
      name: "Estate Block",
      dataKey: "estateblock",
      flexGrow: 1,
    },
    {
      name: "Plot",
      dataKey: "plot",
      flexGrow: 1,
    },
    {
      name: "Palm Number",
      dataKey: "palmno",
      flexGrow: 1,
    },
  ];

  const handleEditChange = (trialCode, estate, replicate, plot, palmId, key, value) => {
    var nextData = Object.assign([], tableData);
    nextData.find(item => item.palmId === palmId)[key] = value
    setTableData(nextData);
    const payload = {
      trialCode,estate, 'palmno':value, palmId
    }
    const oldata =  [...dataToBeEdited.palmnos|| []]
    const findIndex  = oldata.findIndex(x => x.palmId === palmId);
    oldata[findIndex] = payload
    if(findIndex === -1){
    setDataToBeEdited(prevState => ({
      palmnos: [...(prevState.palmnos|| []), payload]
    }));
    }else {
      setDataToBeEdited({palmnos: oldata})
    }
  };

  const quickSaveEditedData = () => {
    dataToBeEdited['updatedBy'] = userInfo
    dataToBeEdited['updatedDate'] = new Date().toISOString()
    PalmService.updatePalm(dataToBeEdited).then(
      (data) => {
        setSuccessMessage(true);
      },
      (error) => {}
    );
  };

  return (
    <div id="TrialAction">

      <SuccessMessage
        show={successMessage}
        hide={() => setSuccessMessage("")}
        action="MULTIPALMDATA_UPDATE"
      />

      <div>
        <h4 className="title">
          <span className="desc">Step 1:</span>{" "}
          <span className="purpose">Search Palms</span>
        </h4>
      </div>

      <Grid fluid id="dashboardFilterPanel">
        <Row>
          <div>
            <Col md={4} lg={3} className="dashboardFilterLayout">
              <div className="show-col">
                <ControlLabel className="labelFilter">Trial ID</ControlLabel>
                <SelectPicker
                  data={trialIds}
                  className="dashboardSelectFilter"
                  value={filterValue.trialCode}
                  onChange={(value, e) => setFilterData(value, "trialCode")}
                />
              </div>
            </Col>
          </div>
          <div>
            <Col md={4} lg={3} className="dashboardFilterLayout">
              <div className="show-col">
                <ControlLabel className="labelFilter">Estate</ControlLabel>
                <SelectPicker
                  data={estates}
                  className="dashboardSelectFilter"
                  value={filterValue.estate}
                  onChange={(value, e) => setFilterData(value, "estate")}
                />
              </div>
            </Col>
          </div>

          <Col md={4} lg={3} className="applyButtonLayout">
            <Button
              appearance="primary"
              className="applyButton"
              onClick={applyFilter}
              disabled = {!filterValue.trialCode}
            >
              Apply
            </Button>
          </Col>
          <Col md={4} lg={3} className="resetButtonLayout">
            <Button
              appearance="subtle"
              className="resetButton"
              onClick={resetFilter}
            >
              Reset Filter
            </Button>
          </Col>
        </Row>
      </Grid>

      <hr className="lineBetweenStep" />

      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Edit Palms Information</span>
        </h4>
      </div>

      {tableData.length < 1 ? (
        <div className="imageLayout">
          <img src={SearchMessage} alt="" />
          <p className="desc">
            Please enter <b className="title">Trial ID and Estate</b> to edit
            Palms Information.
          </p>
        </div>
      ) : (
        <>
          <Grid fluid>
            <Row className="show-grid" id="dashboardTableSetting">
              <Col sm={6} md={6} lg={6} className="totalRecordLayout">
                <b>Total records ({tableData.length})</b>
              </Col>

              <FlexboxGrid justify="end">
                <Col mdOffset={6} md={4} lgOffset={9} lg={3}>
                  <SelectPicker
                    data={replicates}
                    className="dashboardSelectFilter"
                    value={filterValue.replicate}
                    onChange={(value, e) => setFilterData(value, "replicate")}
                  />
                </Col>
                <Col md={4} lg={3}>
                  <SelectPicker
                    data={plots}
                    className="dashboardSelectFilter"
                    value={filterValue.plotId}
                    onChange={(value, e) => setFilterData(value, "plotId")}
                  />
                </Col>

                <Col md={3} lg={2} className="quickSaveLayout">
                  <Button
                    className="quickSaveButton"
                    appearance="primary"
                    onClick={quickSaveEditedData}
                  >
                    Quick Save
                  </Button>
                </Col>
              </FlexboxGrid>
            </Row>
          </Grid>
          <Table
            id="dashboardTable"
            data={tableData}
            virtualized
            height={400}
            rowHeight={55}
            shouldUpdateScroll={false}
            wordWrap
          >
            {columns.map((col) => {
              const width = col.width ? col.width : false;
              const flexGrow = col.flexGrow ? col.flexGrow : false;
              const fixed = col.fixed ? col.fixed : false;
              return (
                <Column width={width} flexGrow={flexGrow} fixed={fixed}>
                  <HeaderCell className="tableHeader">{col.name}</HeaderCell>
                  <EditableCell
                    dataKey={col.dataKey}
                    handleEditChange={handleEditChange}
                  />
                </Column>
              );
            })}
          </Table>

          <Grid fluid className="footerLayout">
            <Row className="show-grid">
              <FlexboxGrid justify="end">
                <Col md={5} lg={4} className="cancelButtonLayout">
                  <FlexboxGrid.Item>
                    <Button
                      appearance="subtle"
                      className="cancelButton"
                      onClick={() => dispatch(clearBreadcrumb())}
                    >
                      Cancel
                    </Button>
                  </FlexboxGrid.Item>
                </Col>
              </FlexboxGrid>
            </Row>
          </Grid>
        </>
      )}
    </div>
  );
};

export default EditPalmInformation;
