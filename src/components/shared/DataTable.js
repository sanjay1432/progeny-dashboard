import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumb } from "../../redux/actions/app.action";
import { setFilter, clearFilter } from "../../redux/actions/filter.action";
import { clearReset} from "../../redux/actions/reset.action"
import {
  getDashboardData,
  getPalmData,
} from "../../redux/actions/dashboarddata.action";
import GeneralHelper from "../../helper/general.helper";
import DeleteModal from "../modal/DeleteModal";
import { progenySubject, resetSubject } from "../../services/pubsub.service";
import DashboarddataService from "../../services/dashboarddata.service";
import ProgenyService from "../../services/progeny.service";
import SuccessMessage from "../SharedComponent/SuccessMessage";
import SearchMessage from "../../assets/img/SearchMessage.svg";
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
  SelectPicker,
  Icon,
  Tooltip,
  Whisper,
  Loader
} from "rsuite";
import OpenNew from "../../assets/img/icons/open_in_new_24px.svg";
import LinkIcon from "../../assets/img/icons/link_24px.svg";
import CreateIcon from "../../assets/img/icons/create_24px.svg";
import QrCodeScanner from "../../assets/img/icons/qr_code_scanner_24px.svg";
import ConfirmationModal from "../SharedComponent/ConfirmationModal";
import PalmService from "../../services/palm.service";
import PlotService from "../../services/plot.service";
import DashboardDataService from "../../services/dashboarddata.service";
import { StatusCell, EditableCell } from "../SharedComponent/Table/CustomCell";
import MapEstates from "../estate/MapEstates";
import { isEmpty } from "lodash";
import Columns from "../SharedComponent/Table/Columns";
import perPage from '../SharedComponent/Table/PaginationOption.json'
const { Column, HeaderCell, Cell } = Table;
const initialState = {
  displaylength: 10,
  prev: true,
  next: true,
  first: false,
  last: false,
  ellipsis: true,
  boundaryLinks: true,
  activePage: 1,
};

let currentTableDataFields = [];
let palmReplicates = [];
let palmPlots = [];
let replicateSelector = "All";
let plotSelector = "All";
const DataTable = ({ currentSubNavState, currentItem, ...props }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    currentTableDataFields = [];
    // SET TABLE DATA
    setCurrentTableData();
    }
  );

  const resetData = useSelector((state) => state.resetReducer);

  const attachProgeny = <Tooltip>Data exists for Palms</Tooltip>;
  const notAttachProgeny = <Tooltip>Progeny not attached</Tooltip>;
  const editProgeny = <Tooltip>Data exists for Palms</Tooltip>;
  const closedTrial = <Tooltip>Trial has been Closed</Tooltip>;
  const [successMessage, setSuccessMessage] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [action, setAction] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errorData, setErrorData] = useState("");
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState("");
  const [isModal, setModal] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [rowsToDelete, setRowsToDelete] = useState([]);
  const [pagination, setPagination] = useState(initialState);
  const [checkStatus, setCheckStatus] = useState([]);
  const { activePage, displaylength } = pagination;
  const { active } = currentSubNavState;
  console.log(active)
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [progenies, setProgenies] = useState([]);
  const [progenyData, setProgenyData] = useState([]);
  const [palmFilter, setPalmFilter] = useState(true);
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  //Filter data in Palm Page
  const [replicateFilter, setReplicateFilter] = useState("All");
  const [plotFilter, setPlotFilter] = useState("All");

  useEffect(async () => {
    function subscribedData(data) {
      itemSaved(data);
      handleChangeLength(1)
    }
    progenySubject.subscribe((data) => {
      subscribedData(data);
    });


    
    if (active === "plot") {
      const progenies = await DashboardDataService.getDashboardData("progeny");
      if (progenies) {
        const { data } = progenies;
        setProgenyData(data);
        let selectionData = [];
        data.forEach((progeny) => {
          selectionData.push({
            label: progeny.progenyCode,
            value: progeny.progenyId,
          });
        });
        setProgenies(selectionData);
      }
    }
  }, []);

  useEffect(() => {
    async function originalData() {
      const data = await DashboarddataService.getOriginalData(active)
      //console.log(data)
      setOriginalData(data)
    }
    originalData();
  }, [tableData])

  const { user } = useSelector((state) => state.authReducer);

  const userInfo = GeneralHelper.buildDisplayName(
    user.firstName,
    user.lastName,
    user.username
  );

  function itemSaved(payload) {
    switch (payload.type) {
      case "TRIAL":
        // setSuccessData(payload)
        // setSuccessModal(true)
        break;
      case "TRIAL_PLOTS_ATTACHED_TO_PROGENY":
        setAction(payload.action);
        setSuccessData(payload.data);
        setSuccessMessage(true);
        break;
      case "PROGENY_CREATE":
      case "PROGENY_UPDATE":
      case "USER_CREATE":
      case "USER_UPDATE":
        setAction(payload.type);
        setSuccessData(payload.data);
        setSuccessMessage(true);
        break;
      default:
        return "";
    }
  }

  function handleChangePage(dataKey) {
    setPagination(() => ({ ...pagination, activePage: dataKey }));
  }
  function handleChangeLength(dataKey) {
    setPagination(() => ({
      ...pagination, 
      displaylength: parseInt(dataKey),
    }));
  }

  function getNoPages() {
    const { displaylength } = pagination;
    return Math.ceil(
      getFilteredDataWithoutDisplayLength().length / displaylength
    );
  }

  const filterData = useSelector((state) => state.filterReducer);

  function setTrialEstateReplicates(currentPalmTableData) {
    if (active === "palm") {
      palmReplicates = [];
      palmPlots = [];
      replicateSelector = "All";
      plotSelector = "All";
      //SET REPLICATES
      if (currentPalmTableData !== undefined && currentPalmTableData.length > 0) {
        const reps = [
          ...new Set(currentPalmTableData.map((palm) => palm.replicateno)),
        ];
        // const plots = [
        //   ...new Set(currentPalmTableData.map((palm) => palm.plotId)),
        // ];
        const plots =  [...new Map(currentPalmTableData.map(item =>
          [item['plotId'], item])).values()];
        reps.forEach((rep) => {
          palmReplicates.push({
            label: rep,
            value: rep,
          });
        });

        palmReplicates =  palmReplicates.sort((a,b)=> a.value - b.value)
        palmReplicates.unshift({
          label: `All Replicates`,
          value: `All`,
        });

        plots.forEach((plot) => {
          palmPlots.push({
            label: plot.plot,
            value: plot.plotId,
          });
        });
        palmPlots =  palmPlots.sort((a,b)=> a.value - b.value)
        palmPlots.unshift({
          label: `All Plots`,
          value: `All`,
        });
      }
    }
  }

  function showPalmRecord() {
    return (
      filterData.filter.hasOwnProperty("trialCode") &&
      filterData.filter.hasOwnProperty("estate")
    );
  }
  const dashboardData = useSelector((state) => state.dashboardDataReducer);
  function setCurrentTableData() {
    if (dashboardData.result[active]) {
      if (!activeRow) {
        setTableData(dashboardData.result[active]);
      }
      const firstRow = dashboardData.result[active][0];
      const availableKeys = Object.keys(firstRow);
      
      availableKeys.forEach((key) => {
        const field = Columns(active).find((field) => field.value === key);
        if (field) {
          currentTableDataFields.push(field);
        }
      });
    }
  }

  function calculateStringCharAtCode(string) {
    const stringArray = string.split("");
    let sum = 0;
    for (let i = 0; i < stringArray.length; i++) {
      const size = stringArray[i].charCodeAt();
      sum += size;
    }

    return sum;
  }

  function getData(displaylength) {
    let currentTableData = [...tableData];

    if(resetData && active !== 'trial'){
      currentTableData.forEach((row, i) => {
        delete row.status;
        if(i===currentTableData.length-1){
          
           dispatch(clearReset())
        }
      });
    }
    if(resetData && (active === 'trial' || active === 'estate' ||active === 'plot'||active === 'progeny')){
      handleChangePage(1)
      dispatch(clearReset())
    }

    if(active === "palm") {
      console.log(currentTableData)
      if (filterData.filter['replicateno'] !== "All" && filterData.filter['replicateno'] !== undefined) {
        currentTableData = currentTableData.filter(item => item.replicateno === filterData.filter['replicateno'])
      }
      if (filterData.filter['plotId'] !== "All" && filterData.filter['plotId'] !== undefined) {
        currentTableData = currentTableData.filter(item => item.plotId === filterData.filter['plotId'])
      }

      setTrialEstateReplicates(currentTableData);

      return currentTableData.filter((v, i) => {
        v["check"] = false;
        v["rowNumber"] = i;
        const start = displaylength * (activePage - 1);
        const end = start + displaylength;
        return i >= start && i < end;
      });
    }

    if( filterData.filter !== "") {
     currentTableData = filterTable(filterData.filter, currentTableData);
    }

    if (sortColumn && sortType) {
      currentTableData.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = calculateStringCharAtCode(x);
        }
        if (typeof y === "string") {
          y = calculateStringCharAtCode(y);
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }

    return currentTableData.filter((v, i) => {
      v["check"] = false;
      v["rowNumber"] = i;
      const start = displaylength * (activePage - 1);
      const end = start + displaylength;
      return i >= start && i < end;
    });
  }

  function getFilteredDataWithoutDisplayLength() {
    let currentTableData = [...tableData];
    
    if (Object.keys(filterData).length > 0 && filterData.filter !== "") {
      currentTableData = filterTable(filterData.filter, currentTableData);
    }
    return currentTableData;
  }

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      <div>
        <Checkbox
          value={rowData[dataKey]}
          inline
          onChange={onChange}
          checked={checkedKeys.some((item) => item === rowData[dataKey])}
        />
      </div>
    </Cell>
  );

  let checked = false;
  let indeterminate = false;
  let disabled = true;

  if (checkStatus.length === 0) {
    disabled = true;
  } else if (checkStatus.length > 0 && checkStatus.length < tableData.length) {
    indeterminate = true;
    disabled = false;
  } else if (checkStatus.length === tableData.length) {
    checked = true;
    disabled = false;
  }

  const handleCheckAll = (value, checked) => {
    const keys = checked ? tableData.map((item) => item.rowNumber) : [];
    setCheckStatus(keys);
  };

  const handleCheck = (value, checked) => {
    const keys = checked
      ? [...checkStatus, value]
      : checkStatus.filter((item) => item !== value);
    setCheckStatus(keys);
  };

  function openConfirmationModal(rowData) {
    setConfirmationModal(true);
    setConfirmationData(rowData);
  }

  function closeConfirmationModal() {
    setConfirmationModal(false);
    setErrorMessage("");
  }

  function filterTable(filters, data) {
    var filterKeys = Object.keys(filters);
    return data.filter(function (eachObj) {
      if(active === "palm"){
        return filterKeys.every(function (eachKey) {
          if (active === "trial" && eachKey === "estate") {
            const estates = eachObj[eachKey].map((est) => est.name);
            return estates.includes(filters[eachKey]);
          }
          if (active === "trial" && eachKey === "planteddate") {
            const date = eachObj[eachKey];
            return GeneralHelper.modifyDate({ date }) === filters[eachKey];
          }
          return eachObj[eachKey] === filters[eachKey];
        });
      }else {
        return filterKeys.some(function (eachKey) {
          if (active === "trial" && eachKey === "estate") {
            const estates = eachObj[eachKey].map((est) => est.name);
            return estates.includes(filters[eachKey]);
          }
          if (active === "trial" && eachKey === "planteddate") {
            const date = eachObj[eachKey];
            return GeneralHelper.modifyDate({ date }) === filters[eachKey];
          }
          if(typeof eachObj[eachKey] !== 'string'){
            return eachObj[eachKey] === filters[eachKey];
          }
          return eachObj[eachKey].toLowerCase() === filters[eachKey].toLowerCase();
        });
      }
     
    });
  }

  function CloseModal(message) {
    if (typeof message !== "object") {
      setAction("ESTATE_MAPPED");
      setSuccessData(message);
      setSuccessMessage(true);
    }

    setModal(!isModal);
  }
  function AddButton() {
    switch (active) {
      case "estate":
        return (
          <Col md={5} lg={4}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addTrialButton"
                onClick={() => setModal(!isModal)}
              >
                Map Estate
              </Button>
            </FlexboxGrid.Item>

            <MapEstates
              show={isModal}
              hide={CloseModal}
              currentSubNavState={currentSubNavState}
              currentItem={currentItem}
            />
          </Col>
        );
      case "trial":
        return (
          <Col md={5} lg={4} className="addButtonLayout">
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addTrialButton"
                onClick={() =>
                  handleActionExpand(
                    ["Trial and Replicate", `Add New Trial & Replicate`],
                    {
                      trial: null,
                      type: "create",
                    }
                  )
                }
              >
                Add New Trial
              </Button>
            </FlexboxGrid.Item>
          </Col>
        );
      case "plot":
        return (
          <Col md={5} lg={5} className="addButtonLayout">
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="attachProgeniesButton"
                onClick={() =>
                  handleActionExpand(["Plot", `Attach Progenies`], {
                    type: "attach",
                  })
                }
              >
                Attach Progenies
              </Button>
            </FlexboxGrid.Item>
          </Col>
        );
      case "progeny":
        return (
          <Col md={5} lg={4} className="addButtonLayout" style={{ textAlign: "center" }}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addProgenyButton"
                onClick={() =>
                  handleActionExpand(["Progeny", `Add New Progeny`], {
                    type: "add",
                  })
                }
              >
                Add New Progeny
              </Button>
            </FlexboxGrid.Item>
          </Col>
        );
      case "userlist":
        function openPage() {
          handleActionExpand(["User List", "Add New User"], {});
        }
        return (
          <Col sm={5} md={5} lg={4} className="addButtonLayout">
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
        );
      default:
        return "";
    }
  }

  function DeleteButton() {
    if (active === "progeny") {
      return (
        <Col sm={4} md={4} lg={3} className="deleteButtonLayout">
          <FlexboxGrid.Item>
            <div>
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
      );
    } else {
      return null;
    }
  }

  const handlePlotEditChange = (plotId, key, value) => {
    const nextData = Object.assign([], tableData);
    nextData.find((item) => item.plotId === plotId)[key] = value;

    if (key === "progenyCode") {
      // Set the progeny values values
      const progeny = progenyData.find((p) => p.progenyId === value);
      nextData.find((item) => item.plotId === plotId)["progeny"] =
        progeny.progeny;
      nextData.find((item) => item.plotId === plotId)["fp"] = progeny.fp;
      nextData.find((item) => item.plotId === plotId)["mp"] = progeny.mp;
      nextData.find((item) => item.plotId === plotId)["ortet"] = progeny.ortet;
    }
    setTableData(nextData);
  };

  function handlePlotEditStatus(plotId) {
    setSuccessMessage(false);
    const nextData = Object.assign([], tableData);
    nextData.forEach(item => {
      if( item.plotId !== plotId){
         delete item.status;
      }
    });
    const activeItem = nextData.find((item) => item.plotId === plotId);
    setActiveRow({ ...activeItem });
    activeItem.status = activeItem.status ? null : true;
    setTableData(nextData);
  }

  function cancelPlotData(plotId) {
    const nextData = Object.assign([], originalData);
    const activeItemIdx = nextData.findIndex((item) => item.plotId === plotId);
    if (activeRow) {
      nextData[activeItemIdx] = activeRow;
    }
    delete nextData[activeItemIdx].status
    setTableData(nextData);
  }

  function savePlotData(plotId) {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find((item) => item.plotId === plotId);
    const { plot, progenyCode } = confirmationData;

    const payload = {
      plotid: plotId,
      progenyid: progenyCode,
      plotno: plot,
      updatedBy: userInfo,
      updatedDate: new Date().toISOString(),
    };

    PlotService.updatePlot(payload).then(
      (data) => {
        //dispatch(getDashboardData("plot"));
        setTableData(nextData);
        activeItem.status = activeItem.status ? null : true;
        setConfirmationModal(false);
        setSuccessData(confirmationData);
        setAction("PLOTDATA_UPDATE");
        setSuccessMessage(true);
        setActiveRow(null);
      },
      (error) => {
        setConfirmationModal(false);
        setErrorData(error.message);
        setErrorMessage(active);
      }
    );
  }

  const handlePalmEditChange = (palmId, key, value) => {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find((item) => item.palmId === palmId);

    activeItem[key] = value;
    setTableData(nextData);
  };

  function handlePalmEditStatus(palmId) {
    setSuccessMessage(false);
    const nextData = Object.assign([], tableData);
    nextData.forEach(item => {
      if( item.palmId !== palmId){
         delete item.status;
      }
    });
    const activeItem = nextData.find((item) => item.palmId === palmId);
    setActiveRow({ ...activeItem });
    activeItem.status = activeItem.status ? null : true;
    setTableData(nextData);
  }

  function cancelPalmData(palmId) {
    const nextData = Object.assign([], tableData);
    const activeItemIdx = nextData.findIndex((item) => item.palmId === palmId);
    if (activeRow) {
      nextData[activeItemIdx] = activeRow;
    }
    delete nextData[activeItemIdx].status
    setTableData(nextData);
    fetchCurrentTrialPalmData();
  }

  function fetchCurrentTrialPalmData() {
    const foundTrial = dashboardData.result["trial"].find(
      (trial) => trial.trialCode === filterData.filter.trialCode
    );
    const foundEstate = foundTrial.estate.find(
      (est) => est.name === filterData.filter.estate
    );
    const payload = {
      trialId: foundTrial.trialId,
      estateId: foundEstate.id,
    };
    dispatch(getPalmData(payload));
  }

  function savePalmData(trialId) {
    const nextData = Object.assign([], tableData);
    const activeItem = nextData.find((item) => item.trialId === trialId);
    const payload = {
      palmnos: [
        {
          trialCode: confirmationData.trialCode,
          estate: confirmationData.estate,
          palmno: confirmationData.palmno,
          palmId: confirmationData.palmId,
        },
      ],
      updatedBy: userInfo,
      updatedDate: new Date().toISOString(),
    };
    PalmService.updatePalm(payload).then(
      (data) => {
        setTableData(nextData);
        activeItem.status = activeItem.status ? null : true;
        setConfirmationModal(false);
        setSuccessData(confirmationData);
        setAction("PALMDATA_UPDATE");
        setSuccessMessage(true);
        setActiveRow(null);
        fetchCurrentTrialPalmData();
      },
      (error) => {
        setConfirmationModal(false);
        setErrorData(error.message);
        setErrorMessage(active);
      }
    );
  }

  function getTrailEditStatus(trialId){
    const trails = dashboardData.result['trial']
    const {isEditable, status}  = trails.find((trial)=> trial.trialId === trialId)
    console.log(status)
     return {isEditable, status}
  }
  function ActionButtons({ data }) {
    switch (active) {
      case "estate":
        return (
          <span style={{ cursor: "pointer" }}>
            <img
              src={OpenNew}
              alt=""
              onClick={() =>
                handleActionExpand(["Estate", `Estate ${data.estate}`], {
                  type: "add",
                  estate: data.estate,
                  estateId: data.estateId,
                })
              }
            />
          </span>
        );
      case "trial":
        console.log(data.isEditable)
        const trialIsEditable = 
        data.isEditable === "true" && 
        data.status === "Finished" || data.status === "Pending" || data.status === "Active" ? true : false;
        return (
          <FlexboxGrid className="spaceBetweenThree" justify="space-between">
            <FlexboxGrid.Item>
              <img
                src={OpenNew}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleActionExpand(
                    ["Trial and Replicate", `Trial ${data.trialCode}`],
                    {
                      trial: data,
                      columnEditable: trialIsEditable,
                      // estate: data.estate,
                      // replicates:data.replicates,
                      type: "expand",
                    }
                  )
                }
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {trialIsEditable ? (
                <img
                  src={CreateIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleActionExpand(
                      ["Trial and Replicate", `Edit Trial and Replicate`],
                      {
                        trial: data.trialId,
                        estate: data.estate,
                        replicates: data.replicates,
                        type: "edit",
                      }
                    )
                  }
                />
              ) : (
                <Whisper
                  placement="left"
                  trigger="hover"
                  speaker={data.status === "Closed" ? closedTrial : editProgeny}
                >
                  <img src={CreateIcon} style={{ opacity: 0.2 }} alt="create" />
                </Whisper>
              )}
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {trialIsEditable ? (
                <img
                  src={LinkIcon}
                  alt="edit"
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    handleActionExpand(
                      ["Trial and Replicate", `Attach Progenies`],
                      {
                        trial: data.trialCode,
                        trialId: data.trialId,
                        estate: data.estate,
                        replicates: data.replicates,
                        type: "attach",
                      }
                    )
                  }
                />
              ) : (
                <Whisper
                  placement="left"
                  trigger="hover"
                  speaker={
                    data.status === "Closed" ? closedTrial : attachProgeny
                  }
                >
                  <img src={LinkIcon} style={{ opacity: 0.2 }} alt="link" />
                </Whisper>
              )}
            </FlexboxGrid.Item>
          </FlexboxGrid>
        );
      case "plot":
        const plotIsQRCode = getTrailEditStatus(data.trialId).status !== "Pending"
        const plotIsEditable = getTrailEditStatus(data.trialId).status !== "Pending" || getTrailEditStatus(data.trialId).status !== "Closed" || getTrailEditStatus(data.trialId).status !== "Canceled";
        const plotIsAttachable = getTrailEditStatus(data.trialId).status !== "Pending" || getTrailEditStatus(data.trialId).status !== "Closed" || getTrailEditStatus(data.trialId).status !== "Canceled";

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
                    onClick={() => cancelPlotData(data.plotId)}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : (
              <FlexboxGrid justify="space-between">
                <FlexboxGrid.Item>
                    {plotIsQRCode ? (
                      <img
                        src={QrCodeScanner}
                        alt=""
                        style={{
                        cursor: "pointer" }}
                        onClick={() =>
                          handleActionExpand(["Plot", "Generate QR Code"], {
                            type: "generate QR",
                            plotId: data.plotId,
                            trialCode: data.trialCode,
                            trial: data.trial,
                            plot: data.plot,
                          })
                        }
                      />
                  ) : (
                      <img
                        src={QrCodeScanner}
                        alt=""
                        style={{ opacity: 0.2 }}
                      />
                  )}
                </FlexboxGrid.Item>

               
              <FlexboxGrid.Item>
                {plotIsEditable ? (
                  <img
                  src={CreateIcon}
                  alt=""
                  style={{ cursor: "pointer" }}
                  onClick={() => handlePlotEditStatus(data.plotId)}
                />
                  ):(
                    <Whisper
                    placement="left"
                    trigger="hover"
                    speaker={
                      data.status === "Pending" && notAttachProgeny,
                      data.status === "Closed" && closedTrial,
                      data.status === "Canceled" && editProgeny
                      }
                  >
                    <img src={CreateIcon} style={{ opacity: 0.2 }} alt="create" />
                  </Whisper>
                  )}
                  
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                  {plotIsAttachable ?(
                  <img
                    src={LinkIcon}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleActionExpand(["Plot", "Edit Palms Information"], {
                        type: "edit",
                        trialCode: data.trialCode,
                        trialId: data.trialId,
                        estate: data.estate,
                        replicate: data.replicate,
                        plot: data.plot,
                      })
                    }
                  />
                ):(
                  <Whisper
                  placement="left"
                  trigger="hover"
                  speaker={
                    data.status === "Closed" ? closedTrial : attachProgeny
                  }
                >
                  <img src={LinkIcon} style={{ opacity: 0.2 }} alt="link" />
                </Whisper>
                )}
                </FlexboxGrid.Item>
              </FlexboxGrid>
            )}
          </>
        );
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
                    onClick={() => cancelPalmData(data.palmId)}
                  />
                </FlexboxGrid.Item>
              </FlexboxGrid>
            ) : (
              <img
                src={CreateIcon}
                alt=""
                style={{ cursor: "pointer" }}
                onClick={() => handlePalmEditStatus(data.palmId)}
              />
            )}
          </>
        );
      case "progeny":
        return (
          <span>
            <img
              src={CreateIcon}
              alt=""
              style={{ cursor: "pointer" }}
              onClick={() =>
                handleActionExpand(["Progeny", "Edit Progeny"], {
                  type: "edit",
                  ...data
                })
              }
            />
          </span>
        );
      // case "userlist":
      //   return (
      //     <span>
      //       <img
      //         src={CreateIcon}
      //         alt=""
      //         onClick={() =>
      //           handleActionExpand(["User List", "Edit User"], {
      //             userId: data.userId,
      //             username: data.username,
      //             position: data.position,
      //             status: data.status,
      //           })
      //         }
      //       />
      //     </span>
      //   );
      default:
        return null;
    }
  }

  function handleActionExpand(breadcrumb, option) {
    dispatch(setBreadcrumb({ breadcrumb, option }));
  }

  function onDelete() {
    const rows = tableData.filter((r, i) => checkStatus.includes(i));
    setRowsToDelete(rows);
    setDeleteModal(true);
  }

  function handleDeleteRecords() {
    if (active === "progeny") {
      const progenyIds = rowsToDelete.map((pId) => pId.progenyId);
      ProgenyService.deleteProgeny({ progenyIds }).then(
        (data) => {
          dispatch(getDashboardData("progeny"));
          setDeleteModal(false);
          //Display success message
          setCheckStatus([])
          setSuccessMessage(true);
          setAction("PROGENY_DELETE");
        },
        (error) => {
          console.log(error.message);
        }
      );
    }
  }

  const ErrorMessage = ({ activeNav, errorData }) => {
    if(activeNav === "plot" && errorData !== undefined) {
      return (
        <>
          <Message
            showIcon
            type="error"
            description={`${errorData} is the problem unable to edit plot`}
            onClick={() => {
              setErrorMessage("");
            }}
          />
        </>
      );
    } 
    else if (activeNav === "palm" && errorData !== undefined) {
      return (
        <>
          <Message
            showIcon
            type="error"
            description={`${errorData} is the problem unable to edit palm.`}
            onClick={() => {
              setErrorMessage("");
            }}
          />
        </>
      );
    } else {
      return null;
    }
  }

  function handleSortColumn(sortColumn, sortType) {
    //console.log(sortType, sortColumn)
    setSortType(sortType);
    setSortColumn(sortColumn);
    setTableLoading(true);
    setTimeout(() => {
      setTableLoading(false);
    }, 500);
  }

  if(loading) {
    return (
      <>
        <Loader size="md" content="loading..." backdrop vertical />
      </>
    )
  }

  if(active === "palm" && isEmpty(filterData.filter)) {
    return (
      <div className="imageLayout">
        <img src={SearchMessage} alt="" />
        <p className="desc">
          Please enter <b className="title">Trial ID and Estate</b> to view
          records of Palms.
        </p>
      </div>
    )
  }

  if(active === "palm" && dashboardData.result.isPending) {
    <div className="imageLayout">
      <img src={SearchMessage} alt="" />
      <p className="desc mb-0">This is Pending.</p>
      <p className="desc mt-0">
        Please <b className="title">attach Progeny</b> for this trial
      </p>
    </div>
  }

  return (
    <>
          <div>
            <Grid fluid>
              <Row className="show-grid" id="dashboardTableSetting">
                <Col sm={6} md={6} lg={6} className="totalRecordLayout">
                  <b>
                    Total records ({getFilteredDataWithoutDisplayLength().length}){" "}
                  </b>
                </Col>

                <FlexboxGrid justify="end">
                  {active === "palm" && palmReplicates.length ? (
                    <>
                      <Col sm={6} md={6} lg={4} className="replicateFilterLayout">
                        {/* <ControlLabel className="labelFilter">Replicate</ControlLabel> */}
                        <FlexboxGrid.Item>
                          <SelectPicker
                            style={{ width: "151.3px" }}
                            data={palmReplicates}
                            className="dashboardSelectFilter"
                            value={replicateFilter}
                            onChange={(value, e) => {
                              const foundTrial = dashboardData.result["trial"].find((trial) =>trial.trialCode ===filterData.filter.trialCode);
                              const foundEstate = foundTrial.estate.find((est) => est.name === filterData.filter.estate)
                              const payload = {
                                trialId: foundTrial['trialId'],
                                estateId: foundEstate['id']
                              }   

                              if(value !== "All") {
                                filterData.filter["replicateno"] = value;
                              } else {
                                delete filterData.filter["replicateno"]
                              }    

                              if(plotFilter !== "All") {
                                filterData.filter["plotId"] = plotFilter;
                              } else {
                                delete filterData.filter["plotId"]
                              }
                              console.log(filterData.filter)
                              if (replicateFilter === "All" && value === "All") {
                                dispatch(getPalmData(payload));
                              } else {
                                dispatch(getPalmData(payload), () => {
                                  dispatch(setFilter(filterData.filter));
                                });
                              }

                              return setReplicateFilter(value);
                            }}
                          />
                        </FlexboxGrid.Item>
                      </Col>

                      <Col sm={4} md={4} lg={3} className="replicateFilterLayout">
                        <FlexboxGrid.Item>
                          <SelectPicker
                            style={{ width: "121.3px" }}
                            data={palmPlots}
                            className="dashboardSelectFilter"
                            value={plotFilter}
                            onChange={(value, e) => {
                              const foundTrial = dashboardData.result["trial"].find((trial) => trial.trialCode === filterData.filter.trialCode);
                              const foundEstate = foundTrial.estate.find((est) => est.name === filterData.filter.estate)
                              const payload = {
                                trialId: foundTrial['trialId'],
                                estateId: foundEstate['id']
                              }

                              if(replicateFilter !== "All") {
                                filterData.filter["replicateno"] = replicateFilter;
                              } else {
                                delete filterData.filter["replicateno"]
                              }

                              if(value !== "All") {
                                filterData.filter["plotId"] = value;
                              } else {
                                delete filterData.filter["plotId"]
                              }
                              console.log(filterData.filter)
                              if(replicateFilter === "All" && value === "All") {
                                dispatch(getPalmData(payload));
                              } else {
                                dispatch(getPalmData(payload), () => {
                                  dispatch(setFilter(filterData.filter));
                                });
                              }
                              

                              return setPlotFilter(value);
                            }}
                          />
                        </FlexboxGrid.Item>
                      </Col>
                    </>
                  ) : (
                    ""
                  )}

                  <Col sm={5} md={5} lg={5} className="pageOptionLayout">
                    <FlexboxGrid.Item className="selectPage">
                      <InputPicker
                        className="option"
                        data={perPage}
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
                    rowsToDelete={rowsToDelete}
                    data={successData}
                    show={successMessage}
                    hide={() => setSuccessMessage("")}
                    action={action}
                  />

                  <ErrorMessage activeNav={errorMessage} errorData={errorData} />

                  <ConfirmationModal
                    show={confirmationModal}
                    hide={closeConfirmationModal}
                    data={confirmationData}
                    savePlotData={savePlotData}
                    savePalmData={savePalmData}
                    action={active}
                  />
                </FlexboxGrid>
              </Row>
            </Grid>

            {tableData.length !== undefined ? (
              <>
                <Table
                  id="dashboardTable"
                  wordWrap
                  virtualized
                  rowHeight={55}
                  data={getData(displaylength)}
                  sortColumn={sortColumn}
                  sortType={sortType}
                  loading={tableLoading}
                  onSortColumn={handleSortColumn}
                  // autoHeight
                  height={500}
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
                  {Columns(active).map((field, i) => {
                    return (
                      <Column
                        width={field.width ? field.width : null}
                        flexGrow={field.flexGrow ? field.flexGrow : null}
                        align={field.align ? field.align : "left"}
                        fixed={field.fixed ? field.fixed : null}
                        key={i}
                        sortable={field.sorting}
                      >
                        <HeaderCell className="tableHeader">{field.name}</HeaderCell>
                        {field.dataKey === "status" ? (
                          <Cell align="center" dataKey={field.dataKey} {...props}>
                            {(rowData) => <StatusCell status={rowData.status} />}
                          </Cell>
                        ) : (
                          <EditableCell
                            dataKey={field.dataKey}
                            OriginalData={tableData}
                            handlePalmEditChange={handlePalmEditChange}
                            handlePlotEditChange={handlePlotEditChange}
                            active={active}
                            progenies={progenies}
                          />
                        )}
                      </Column>
                    )
                  })}

                  <Column width={130} align="center" fixed="right">
                    <HeaderCell className="tableHeader">Action</HeaderCell>
                    <Cell align="center" {...props}>
                      {(rowData) => <ActionButtons data={rowData} />}
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
              </>
            ) : <Loader size="lg" content="Large" />}
          </div>
    </>
  );
};

export default DataTable;
