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
import DeleteModal from "../../components/modal/DeleteModal";
import { progenySubject, resetSubject } from "../../services/pubsub.service";
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
} from "rsuite";
import OpenNew from "../../assets/img/icons/open_in_new_24px.svg";
import LinkIcon from "../../assets/img/icons/link_24px.svg";
import CreateIcon from "../../assets/img/icons/create_24px.svg";
import QrCodeScanner from "../../assets/img/icons/qr_code_scanner_24px.svg";
import ConfirmationModal from "../SharedComponent/ConfirmationModal";
import PalmService from "../../services/palm.service";
import PlotService from "../../services/plot.service";
import DashboardDataService from "../../services/dashboarddata.service";
import MapEstates from "../../components/estate/MapEstates";
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

const EditableCell = ({
  rowData,
  dataKey,
  onChange,
  handlePlotEditChange,
  handlePalmEditChange,
  active,
  progenies,
  OriginalData,
  ...cellProps
}) => {
  const editing = rowData.status === true;
  switch (active) {
    case "trial":
      return (
        <Cell {...cellProps}>
          {dataKey === "estate" ? (
            <span>{getMultipleEstateString(rowData.estate)}</span>
          ) : dataKey === "planteddate" ? (
            <span>{GeneralHelper.modifyDate({ date: rowData[dataKey] })}</span>
          ) : (
            <span>{rowData[dataKey]}</span>
          )}
        </Cell>
      );
    // case "userAssignment":
    //   return (
    //     <Cell {...cellProps}>
    //       {dataKey === "estate" ? (
    //         <span>{getMultipleEstateString(rowData.estate)}</span>
    //       ) : (
    //         <span>{rowData[dataKey]}</span>
    //       )}
    //     </Cell>
    //   );
    case "plot":
      return (
        <>
          {rowData["status"] ? (
            <Cell {...cellProps}>
              {dataKey === "progenyCode" ? (
                <SelectPicker
                  data={progenies}
                  value={rowData[dataKey]}
                  onChange={(value, event) =>
                    handlePlotEditChange(rowData.plotId, dataKey, value)
                  }
                />
              ) : (
                <Input
                  value={rowData[dataKey]}
                  disabled={[
                    "trialCode",
                    "estate",
                    "replicate",
                    "estateblock",
                    "design",
                    "density",
                    "ortet",
                    "fp",
                    "mp",
                    "noofPalm",
                  ].includes(dataKey)}
                  onChange={(value) =>
                    handlePlotEditChange(rowData.plotId, dataKey, value)
                  }
                />
              )}
            </Cell>
          ) : (
            <Cell {...cellProps}>
              <span>{rowData[dataKey]}</span>
            </Cell>
          )}
        </>
      );
    case "palm":
      return (
        <Cell {...cellProps}>
          {rowData["status"] ? (
            <Input
              className="editTableInput"
              defaultValue={rowData[dataKey]}
              disabled={[
                "trialCode",
                "estate",
                "replicate",
                "estateblock",
                "plot",
              ].includes(dataKey)}
              onChange={(value, e) =>
                handlePalmEditChange(rowData.palmId, dataKey, e.target.value)
              }
            />
          ) : (
            <span>{rowData[dataKey]}</span>
          )}
        </Cell>
      );
    default:
      return (
        <Cell {...cellProps}>
          <span>{rowData[dataKey]}</span>
        </Cell>
      );
  }
};

function getMultipleEstateString(estates) {
  let estateString = "";
  estates.forEach((element, idx) => {
    const pipe = estates.length - idx > 1 ? "|" : "";
    estateString += ` ${element.name} ${pipe}`;
  });

  return estateString;
}

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

  });
  const resetData = useSelector((state) => state.resetReducer);

  const attachProgeny = <Tooltip>Data exists for Palms</Tooltip>;
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
  const [tableData, setTableData] = useState([]);
  const [activeRow, setActiveRow] = useState(null);
  const [progenies, setProgenies] = useState([]);
  const [progenyData, setProgenyData] = useState([]);
  const [palmFilter, setPalmFilter] = useState(false);
  const [sortColumn, setSortColumn] = useState("");
  const [sortType, setSortType] = useState("asc");
  const [loading, setLoading] = useState(false);

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

  const tableDataFields = [
    {
      label: "Estate",
      value: "estate",
    },
    {
      label: "Estate Full Name",
      value: "estatefullname",
    },
    {
      label: "No of Estate Block",
      value: "noofestateblock",
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails",
    },
    {
      label: "No. Trials on this Estate",
      value: "nooftrails",
    },
    {
      label: "Trial ID",
      value: "trialCode",
    },
    {
      label: "Trial",
      value: "trial",
    },
    {
      label: "Type",
      value: "type",
    },
    {
      label: "Trial Remarks",
      value: "trialremark",
    },
    {
      label: "Area (ha)",
      value: "area",
    },
    {
      label: "Planted Date",
      value: "planteddate",
    },
    {
      label: "n Progeny",
      value: "nofprogeny",
    },
    {
      label: "n Of Replicate",
      value: "nofreplicate",
    },
    {
      label: "n Of Plot",
      value: "nofplot",
    },
    {
      label: "n Of Subblock/Rep",
      value: "nofsubblock",
    },
    {
      label: "n Of Plot/subblock",
      value: "nofplot_subblock",
    },
    {
      label: "Status",
      value: "status",
    },
    {
      label: "Replicate",
      value: "replicate",
    },
    {
      label: "Replicate",
      value: "replicateId",
    },
    {
      label: "Replicate",
      value: "replicateno",
    },
    {
      label: "Estate Block",
      value: "estateblock",
    },
    {
      label: "Design",
      value: "design",
    },
    {
      label: "Density",
      value: "density",
    },
    {
      label: "Plot",
      value: "plot",
    },
    {
      label: "Subblock",
      value: "subblock",
    },
    {
      label: "Progeny ID",
      value: "progenyCode",
    },
    {
      label: "Progeny",
      value: "progeny",
    },
    {
      label: "Ortet",
      value: "ortet",
    },
    {
      label: "FP",
      value: "fp",
    },
    {
      label: "MP",
      value: "mp",
    },
    {
      label: "nPalm",
      value: "noofPalm",
    },
    {
      label: "Palm Number",
      value: "palmno",
    },
    {
      label: "Progeny ID",
      value: "progenyCode",
    },
    {
      label: "Pop Var",
      value: "popvar",
    },
    {
      label: "Origin",
      value: "origin",
    },
    {
      label: "Progeny Remark",
      value: "progenyremark",
    },
    {
      label: "Progeny Remark",
      value: "progenyremark",
    },
    {
      label: "Generation",
      value: "generation",
    },
    {
      label: "FP Fam",
      value: "fpFam",
    },
    {
      label: "FP Var",
      value: "fpVar",
    },
    {
      label: "MP Fam",
      value: "mpFam",
    },
    {
      label: "MP Var",
      value: "mpVar",
    },
    {
      label: "Cross",
      value: "cross",
    },
    {
      label: "Cross Type",
      value: "crossType",
    },
    {
      label: "User ID",
      value: "userId",
    },
    {
      label: "Username",
      value: "username",
    },
    {
      label: "Position",
      value: "position",
    },
    {
      label: "No. Trials on this Estate",
      value: "noTrialOnHere",
    },
    {
      label: "No.of Users Assigned",
      value: "assignedUser",
    },
  ];

  const perpage = [
    {
      label: "10",
      value: "10",
    },
    {
      label: "20",
      value: "20",
    },
    {
      label: "50",
      value: "50",
    },
    {
      label: "100",
      value: "100",
    },
  ];
  function handleChangePage(dataKey) {
    console.log({pagination})
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

  function setTrialEstateReplicates() {
    if (active === "palm") {
      let currentPalmTableData = [...dashboardData.result[active]];
      palmReplicates = [];
      palmPlots = [];
      replicateSelector = "All";
      plotSelector = "All";
      //SET REPLICATES
      if (currentPalmTableData.length > 0) {
        const reps = [
          ...new Set(currentPalmTableData.map((palm) => palm.replicate)),
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
        console.log(dashboardData.result[active])
        setTableData(dashboardData.result[active]);
      }
      const firstRow = dashboardData.result[active][0];
      const availableKeys = Object.keys(firstRow);

      availableKeys.forEach((key) => {
        const field = tableDataFields.find((field) => field.value === key);
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
    setTrialEstateReplicates();
    // if (
    //   Object.keys(filterData).length > 0 &&
    //   filterData.filter !== "" &&
    //   active != "palm"
    // ) {
    //   currentTableData = filterTable(filterData.filter, currentTableData);
    //   // return currentTableData;
    // }
    //   if(palmFilter) {
    //     currentTableData = filterTable(filterData.filter, currentTableData);
    //     // return currentTableData;
    //   }
    if( filterData.filter !== "") {
     return currentTableData = filterTable(filterData.filter, currentTableData);
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
  async function OpenModal() {
    setModal(!isModal);
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
          <Col sm={5} md={5} lg={3}>
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addTrialButton"
                onClick={OpenModal}
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
          <Col sm={5} md={5} lg={4} className="addButtonLayout">
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addTrialButton"
                onClick={() =>
                  handleAddNewTrial(
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
          <Col sm={5} md={5} lg={5} className="addButtonLayout">
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="attachProgeniesButton"
                onClick={() =>
                  handleActionExpand(["Plot", `Attach Progenies`], {
                    // trial: data.trialCode,
                    // trialId: data.trialId,
                    // estate: data.estate,
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
          <Col sm={5} md={6} lg={5} className="addButtonLayout">
            <FlexboxGrid.Item>
              <Button
                appearance="primary"
                className="addProgenyButton"
                onClick={() =>
                  handleAddNewTrial(["Progeny", `Add New Progeny`], {
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
        return null;
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

  function StatusButton({ status }) {
    switch (status) {
      case "Active":
        return (
          <Button className="activeStatusButton" style={{ cursor: "default" }}>
            Active
          </Button>
        );
      case "Inactive":
        return (
          <Button
            className="inavtiveStatusButton"
            style={{ cursor: "default" }}
          >
            Inactive
          </Button>
        );
      case "Canceled":
        return (
          <Button
            className="canceledStatusButton"
            style={{ cursor: "default" }}
          >
            Canceled
          </Button>
        );
      case "Pending":
        return (
          <Button className="pendingStatusButton" style={{ cursor: "default" }}>
            Pending
          </Button>
        );

      case "Finished":
        return (
          <Button
            className="finishedStatusButton"
            style={{ cursor: "default" }}
          >
            Finished
          </Button>
        );
      case "Closed":
        return (
          <Button
            className="finishedStatusButton"
            style={{ cursor: "default" }}
          >
            Closed
          </Button>
        );

      default:
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
    const nextData = Object.assign([], tableData);
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
    activeItem.status = activeItem.status ? null : true;
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
        dispatch(getDashboardData("plot"));
        setActiveRow(null);
        setTableData(nextData);
        setConfirmationModal(false);
        setSuccessData(confirmationData);
        setAction("PLOTDATA_UPDATE");
        setSuccessMessage(true);
      },
      (error) => {
        setErrorMessage(active);
        setErrorData(error.message);
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
    setActiveRow(null);
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
        setSuccessData(confirmationData);
        setAction("PALMDATA_UPDATE");
        setSuccessMessage(true);
        setActiveRow(null);
        //fetchCurrentTrialPalmData();
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
        const editable = 
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
                      columnEditable: editable,
                      // estate: data.estate,
                      // replicates:data.replicates,
                      type: "expand",
                    }
                  )
                }
              />
            </FlexboxGrid.Item>
            <FlexboxGrid.Item>
              {editable ? (
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
              {editable ? (
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
                  <img
                    src={QrCodeScanner}
                    alt=""
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      handleActionExpand(["Plot", "Generate QR Code"], {
                        type: "generate QR",
                        plotId: data.plotId,
                        trialCode: data.trialCode,
                        plot: data.plot,
                      })
                    }
                  />
                </FlexboxGrid.Item>

               
                <FlexboxGrid.Item>
                {getTrailEditStatus(data.trialId).isEditable === "true" && getTrailEditStatus(data.trialId).status !== "Closed" ?(
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
                    speaker={data.status === "Closed" ? closedTrial : editProgeny}
                  >
                    <img src={CreateIcon} style={{ opacity: 0.2 }} alt="create" />
                  </Whisper>
                  )}
                  
                </FlexboxGrid.Item>
                <FlexboxGrid.Item>
                {getTrailEditStatus(data.trialId).isEditable === "true" && getTrailEditStatus(data.trialId).status !== "Closed" ?(
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
                  progenyId: data.progenyId,
                  progenyCode: data.progenyCode,
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
                  crossType: data.crossType,
                })
              }
            />
          </span>
        );
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
                  status: data.status,
                })
              }
            />
          </span>
        );
      default:
        return null;
    }
  }

  function handleActionExpand(breadcrumb, option) {
    dispatch(setBreadcrumb({ breadcrumb, option }));
  }

  function handleAddNewTrial(breadcrumb, option) {
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

  const reArrangeTableFields = () => {
    switch (active) {
      case "estate":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "estate") {
            field.flexGrow = 1;
            field.sorting = true;
            currentTableDataFields[0] = field;
          }
          if (field.value === "estatefullname") {
            field.flexGrow = 1;
            field.sorting = true;
            currentTableDataFields[1] = field;
          }
          if (field.value === "noofestateblock") {
            field.flexGrow = 1;
            field.sorting = true;
            currentTableDataFields[2] = field;
          }
          if (field.value === "nooftrails") {
            field.flexGrow = 1;
            field.sorting = true;
            currentTableDataFields[3] = field;
          }
        });
        return currentTableDataFields;

      case "trial":
        const trialfields = [];
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialCode") {
            field.width = 120;
            field.sorting = true;
            trialfields[0] = field;
          }
          if (field.value === "type") {
            field.width = 200;
            field.sorting = true;
            trialfields[1] = field;
          }
          if (field.value === "trial") {
            field.width = 200;
            field.sorting = true;
            trialfields[2] = field;
          }
          if (field.value === "trialremark") {
            field.width = 500;
            trialfields[3] = field;
          }
          if (field.value === "area") {
            field.width = 300;
            field.sorting = true;
            trialfields[4] = field;
          }
          if (field.value === "planteddate") {
            field.sorting = true;
            field.width = 200;
            trialfields[5] = field;
          }
          if (field.value === "nofprogeny") {
            field.width = 120;
            field.sorting = true;
            trialfields[6] = field;
          }
          if (field.value === "estate") {
            field.width = 120;
            if(active!=='trial'){
              field.sorting = true;
            }
           
            trialfields[7] = field;
          }
          if (field.value === "nofreplicate") {
            field.width = 140;
            field.sorting = true;
            trialfields[8] = field;
          }
          if (field.value === "nofplot") {
            field.width = 120;
            field.sorting = true;
            trialfields[9] = field;
          }
          if (field.value === "nofsubblock") {
            field.width = 170;
            field.sorting = true;
            trialfields[10] = field;
          }
          if (field.value === "nofplot_subblock") {
            field.width = 170;
            field.sorting = true;
            trialfields[11] = field;
          }

          if (field.value === "status") {
            field.width = 130;
            field.align = "center";
            field.fixed = "right";
            trialfields[12] = field;
          }
        });
        return trialfields;

      case "plot":
        const plotfields = [];
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialCode") {
            field.width = 140;
            field.sorting = true;
            plotfields[0] = field;
          }
          if (field.value === "estate") {
            field.width = 140;
            plotfields[1] = field;
          }
          if (field.value === "replicate") {
            field.width = 140;
            field.sorting = true;
            plotfields[2] = field;
          }
          if (field.value === "estateblock") {
            field.width = 140;
            plotfields[3] = field;
          }
          if (field.value === "design") {
            field.width = 140;
            field.sorting = true;
            plotfields[4] = field;
          }
          if (field.value === "density") {
            field.width = 140;
            field.sorting = true;
            plotfields[5] = field;
          }
          if (field.value === "plot") {
            field.width = 140;
            field.sorting = true;
            plotfields[6] = field;
          }
          if (field.value === "subblock") {
            field.width = 140;
            field.sorting = true;
            plotfields[7] = field;
          }
          if (field.value === "progenyCode") {
            field.width = 140;
            field.sorting = true;
            plotfields[8] = field;
          }
          if (field.value === "progeny") {
            field.width = 140;
            field.sorting = true;
            plotfields[9] = field;
          }
          if (field.value === "ortet") {
            field.width = 140;
            field.sorting = true;
            plotfields[10] = field;
          }
          if (field.value === "fp") {
            field.width = 140;
            field.sorting = true;
            plotfields[11] = field;
          }
          if (field.value === "mp") {
            field.width = 140;
            field.sorting = true;
            plotfields[12] = field;
          }
          if (field.value === "noofPalm") {
            field.width = 140;
            field.sorting = true;
            plotfields[13] = field;
          }
        });
        return plotfields;

      case "palm":
        const palmfields = [];
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "trialCode") {
            field.flexGrow = 1;
            palmfields[0] = field;
          }
          if (field.value === "estate") {
            field.flexGrow = 1;
            palmfields[1] = field;
          }
          if (field.value === "replicateno") {
            field.flexGrow = 1;
            field.sorting = true;
            palmfields[2] = field;
          }
          if (field.value === "estateblock") {
            field.flexGrow = 1;
            field.sorting = true;
            palmfields[3] = field;
          }
          if (field.value === "plot") {
            field.flexGrow = 1;
            field.sorting = true;
            palmfields[4] = field;
          }
          if (field.value === "palmno") {
            field.flexGrow = 1;
            field.sorting = true;
            palmfields[5] = field;
          }
        });
        return palmfields;

      case "progeny":
        const fieldsTodisplay = [];
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "progenyCode") {
            field.width = 200;
            field.sorting = true;
            fieldsTodisplay[0] = field;
          }
          if (field.value === "popvar") {
            field.width = 170;
            field.sorting = true;
            fieldsTodisplay[1] = field;
          }
          if (field.value === "origin") {
            field.width = 200;
            field.sorting = true;
            fieldsTodisplay[2] = field;
          }
          if (field.value === "progenyremark") {
            field.width = 200;
            field.sorting = true;
            fieldsTodisplay[3] = field;
          }
          if (field.value === "progeny") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[4] = field;
          }
          if (field.value === "generation") {
            field.width = 170;
            field.sorting = true;
            fieldsTodisplay[5] = field;
          }
          if (field.value === "ortet") {
            field.width = 170;
            field.sorting = true;
            fieldsTodisplay[6] = field;
          }
          if (field.value === "fp") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[7] = field;
          }
          if (field.value === "fpFam") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[8] = field;
          }
          if (field.value === "fpVar") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[9] = field;
          }
          if (field.value === "mp") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[10] = field;
          }
          if (field.value === "mpFam") {
            field.width = 150;
            field.sorting = true;
            fieldsTodisplay[11] = field;
          }
          if (field.value === "mpVar") {
            field.sorting = true;
            field.width = 150;
            fieldsTodisplay[12] = field;
          }
          if (field.value === "cross") {
            field.width = 200;
            field.sorting = true;
            fieldsTodisplay[13] = field;
          }
          if (field.value === "crossType") {
            field.width = 200;
            field.sorting = true;
            fieldsTodisplay[14] = field;
          }
        });
        return fieldsTodisplay;

      case "userlist":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "userId") {
            field.flexGrow = 1;
            currentTableDataFields[0] = field;
          }
          if (field.value === "username") {
            field.flexGrow = 1;
            currentTableDataFields[1] = field;
          }
          if (field.value === "position") {
            field.flexGrow = 4;
            currentTableDataFields[2] = field;
          }
          if (field.value === "status") {
            field.width = 130;
            field.align = "center";
            field.fixed = "right";
            currentTableDataFields[3] = field;
          }
        });
        return currentTableDataFields;

      case "estateAssignment":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "estate") {
            field.flexGrow = 2;
            currentTableDataFields[0] = field;
          }
          if (field.value === "estatefullname") {
            field.flexGrow = 2;
            currentTableDataFields[1] = field;
          }
          if (field.value === "noTrialOnHere") {
            field.flexGrow = 2;
            currentTableDataFields[2] = field;
          }
          if (field.value === "assignedUser") {
            field.flexGrow = 3;
            currentTableDataFields[3] = field;
          }
        });
        return currentTableDataFields;

      case "userAssignment":
        currentTableDataFields.forEach((field, i) => {
          if (field.value === "userId") {
            field.flexGrow = 1;
            currentTableDataFields[0] = field;
          }
          if (field.value === "username") {
            field.flexGrow = 1;
            currentTableDataFields[1] = field;
          }
          if (field.value === "position") {
            field.flexGrow = 1;
            currentTableDataFields[2] = field;
          }
          if (field.value === "estate") {
            field.flexGrow = 4;
            currentTableDataFields[3] = field;
          }
        });
        return currentTableDataFields;

      default:
        return currentTableDataFields;
    }
  };

  function handleSortColumn(sortColumn, sortType) {
    setSortType(sortType);
    setSortColumn(sortColumn);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }

  return (
    <>
      {active === "palm" && !showPalmRecord() ? (
        <div className="imageLayout">
          <img src={SearchMessage} alt="" />
          <p className="desc">
            Please enter <b className="title">Trial ID and Estate</b> to view
            records of Palms.
          </p>
        </div>
      ) : (
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
                    <Col sm={5} md={5} lg={4} className="replicateFilterLayout">
                      {/* <ControlLabel className="labelFilter">Replicate</ControlLabel> */}
                      <FlexboxGrid.Item>
                        <SelectPicker
                          data={palmReplicates}
                          className="dashboardSelectFilter"
                          value={replicateSelector}
                          onChange={(value, e) => {
                            filterData.filter["replicate"] = value;
                            if (value === "All") {
                              delete filterData.filter.replicate;
                              const foundTrial = dashboardData.result[
                                "trial"
                              ].find(
                                (trial) =>
                                  trial.trialCode ===
                                  filterData.filter.trialCode
                              );
                              const foundEstate = foundTrial.estate.find(
                                (est) => est.name === filterData.filter.estate
                              );
                              const payload = {
                                trialId: foundTrial.trialId,
                                estateId: foundEstate.id,
                              };
                              dispatch(getPalmData(payload), () => {
                                dispatch(setFilter(filterData.filter));
                              });
                            } else {
                              setPalmFilter(true)
                              dispatch(setFilter(filterData.filter));
                            }
                            replicateSelector = value;
                          }}
                        />
                      </FlexboxGrid.Item>
                    </Col>

                    <Col sm={5} md={5} lg={4} className="replicateFilterLayout">
                      <FlexboxGrid.Item>
                        <SelectPicker
                          data={palmPlots}
                          className="dashboardSelectFilter"
                          value={plotSelector}
                          onChange={(value, e) => {
                            filterData.filter["plotId"] = value;
                            if (value === "All") {
                              delete filterData.filter.plotId;
                              const foundTrial = dashboardData.result[
                                "trial"
                              ].find(
                                (trial) =>
                                  trial.trialCode ===
                                  filterData.filter.trialCode
                              );
                              const foundEstate = foundTrial.estate.find(
                                (est) => est.name === filterData.filter.estate
                              );
                              const payload = {
                                trialId: foundTrial.trialId,
                                estateId: foundEstate.id,
                              };
                              dispatch(getPalmData(payload), () => {
                                dispatch(setFilter(filterData.filter));
                              });
                            } else {
                              setPalmFilter(true)
                              dispatch(setFilter(filterData.filter));
                            }

                            plotSelector = value;
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

          <Table
            id="dashboardTable"
            wordWrap
            virtualized
            rowHeight={55}
            data={getData(displaylength)}
            sortColumn={sortColumn}
            sortType={sortType}
            loading={loading}
            onSortColumn={handleSortColumn}
            // autoHeight
            height = {500}
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
            {reArrangeTableFields().map((field, i) => (
              <Column
                width={field.width ? field.width : null}
                flexGrow={field.flexGrow ? field.flexGrow : null}
                align={field.align ? field.align : "left"}
                fixed={field.fixed ? field.fixed : null}
                key={i}
                sortable={field.sorting}
              >
                <HeaderCell className="tableHeader">{field.label}</HeaderCell>
                {field.value === "status" ? (
                  <Cell align="center" {...props}>
                    {(rowData) => <StatusButton status={rowData.status} />}
                  </Cell>
                ) : (
                  <EditableCell
                    dataKey={field.value}
                    OriginalData={tableData}
                    handlePalmEditChange={handlePalmEditChange}
                    handlePlotEditChange={handlePlotEditChange}
                    active={active}
                    progenies={progenies}
                  />
                )}
              </Column>
            ))}

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
        </div>
      )}
    </>
  );
};

export default DataTable;
