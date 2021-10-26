import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearBreadcrumb } from "../../redux/actions/app.action";
import { getDashboardData } from "../../redux/actions/dashboarddata.action";
import {
  Table,
  FlexboxGrid,
  Button,
  Icon,
  IconButton,
  Grid,
  Row,
  Col,
  Checkbox,
  Input,
  DatePicker,
  Radio,
  RadioGroup,
  SelectPicker,
  Modal,
  InputNumber,
  Tag,
} from "rsuite";
import EstateService from "../../services/estate.service";

import SubDirectoryIcon from "../../assets/img/icons/subdirectory_arrow_right_24px.svg";

import TrialService from "../../services/trial.service";

import SuccessModal from "../modal/masterData/success/success";
const styles = { width: 280, display: "block", marginBottom: 10 };
const { Column, HeaderCell, Cell } = Table;
const initializeTrailState = {
  trialCode: "",
  trial: "",
  type: "",
  trialremark: "",
  area: "",
  planteddate: "",
  nofprogeny: 0,
  nofreplicate: "",
  nofplot_subblock: 0,
  nofsubblock: 0,
  design: "",
  density: "",
};
const AddNewTrial = ({ currentSubNavState, currentItem, option, ...props }) => {
  const dispatch = useDispatch();
  const [trial, setTrial] = useState(initializeTrailState);
  const [trialTypes, setTrialTypes] = useState([]);
  const [disabledGenerateTable, setDisabledGenerateTable] = useState(true);
  const [estates, setEstates] = useState([]);
  const [estatesWithBlocks, setEstatesWithBlocks] = useState([]);
  const [ebList, setEbList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [isMultplicationValid, setMultplicationValid] = useState(null);
  const [radioInputForTrialInEState, setRadioInputForTrialInEState] =
    useState("yes");
  const [radioInputForSameDensity, setRadioInputForSameDensity] =
    useState("no");
  const [inputListForTrialInEState, setInputListForTrialInEState] = useState([
    { estate: "", estatenofreplicate: "" },
  ]);
  const [checkStatusReplicates, setCheckStatusReplicate] = useState([]);
  const [replicateValue, setReplicateValue] = useState([]);
  const [disbaledANR, setDisbaledANR] = useState(true);
  const [disbaledANRV, setDisbaledANRV] = useState(true);
  const [disbaledRD, setDisbaledRD] = useState(true);
  const [show, setShow] = useState(false);
  const [isSuccessModal, setSuccessModal] = useState(false);
  const [successData, setSuccessData] = useState(null);

  const dashboardData = useSelector((state) => state.dashboardDataReducer);
  const authData = useSelector((state) => state.authReducer);
  useEffect(() => {
    fetchEstates();
    fetchTypes();
    fetchDesigns();
    handleDisableState();
  }, [
    isMultplicationValid,
    trial,
    radioInputForSameDensity,
    tableData,
    inputListForTrialInEState,
  ]);
  async function fetchEstates() {
    const { data } = await EstateService.getUpdatedEstateBlocks();
    setEbList(data);
    const mappedEstates = dashboardData.result["estate"];
    setEstatesWithBlocks(mappedEstates);

    mappedEstates.sort(function (a, b) {
      var keyA = a['estate'],
        keyB = b['estate'];
      // Compare the 2 dates
      if (keyA < keyB) return -1;
      if (keyA > keyB) return 1;
      return 0;
    });

    let mappedEstate = [];
    for (let item in mappedEstates) {
      console.log(item)
      mappedEstate.push({
        label: mappedEstates[item].estate,
        value: mappedEstates[item].estateId,
      });
    }
    console.log("mappedEstate", mappedEstate);

    setEstates(mappedEstate);
  }

  async function fetchTypes() {
    const types = await TrialService.getTrialTypes();
    const mappedTypes = [];

    for (let item in types) {
      mappedTypes.push({ label: types[item], value: types[item] });
    }
    setTrialTypes(mappedTypes);
  }

  async function fetchDesigns() {
    const { data } = await EstateService.getDesigns();
    const mappedDesigns = [];

    for (let item in data) {
      mappedDesigns.push({
        label: data[item].design,
        value: data[item].designId,
      });
    }
    console.log(mappedDesigns);
    setDesigns(mappedDesigns);
  }
  function onInput(e) {
    if (
      ["nofprogeny", "nofsubblock", "nofplot_subblock"].includes(e.target.name)
    ) {
      //Check if Multiplication of No. of Subblock and No. of Plot/Subblock is equal to No. of Progeny.
      const isValid = verifyMultiplicationOfSubblockandPlot(
        e.target.name,
        e.target.value
      );
      setMultplicationValid(isValid);
    }
    e.persist();
    const val =
      e.target.value % 1 > 0 &&
      ["nofprogeny", "nofsubblock", "nofplot_subblock","nofreplicate"].includes(e.target.name)
        ? parseInt(e.target.value)
        : e.target.value;
    setTrial(() => ({ ...trial, [e.target.name]: val }));
    // handleDisableState();
  }
  // handle input change
  const handleTrialInEStateInputChange = (e, index, type) => {
    let name, value;
    if (type === "select") {
      name = "estate";
      value = e;
    } else {
      name = e.target.name;
      value = e.target.value ? parseInt(e.target.value) : 1;

      //UPDATE THE number of Replicare in Trial
      const currentnoOfRep =
        trial.nofreplicate !== "" ? parseInt(trial.nofreplicate) : 0;
      const updatednoOfRep = currentnoOfRep + parseInt(e.target.value);
      setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }));
    }
    const list = [...inputListForTrialInEState];
    list[index][name] = value;
    setInputListForTrialInEState(list);
  };
  function verifyMultiplicationOfSubblockandPlot(name, value) {
    const { nofprogeny, nofsubblock, nofplot_subblock } = trial;
    const progenyNo = name === "nofprogeny" ? value : nofprogeny;
    const subblockNo = name === "nofsubblock" ? value : nofsubblock;
    const plot_subblockNo =
      name === "nofplot_subblock" ? value : nofplot_subblock;
    const multi = parseInt(subblockNo) * parseInt(plot_subblockNo);
    return parseInt(progenyNo) === multi;
  }
  function onRadioInputTrialInEState(e) {
    if (e === "no") {
      console.log(e);
      setTrial(() => ({ ...trial, estate: "" }));
    }
    if (e === "yes") {
      console.log(e);
      setInputListForTrialInEState([{ estate: "", estatenofreplicate: "" }]);
    }
    setRadioInputForTrialInEState(e);
  }
  function onRadioInputSameDensity(e) {
    if (radioInputForSameDensity === "no") {
      trial["density"] = "";
    }
    setRadioInputForSameDensity(e);
  }
  function onAddTrialInEstate() {
    setInputListForTrialInEState([
      ...inputListForTrialInEState,
      { estate: "", estatenofreplicate: "" },
    ]);
    // handleDisableState();
  }
  function onRemoveTrialInEstate(index) {
    const list = [...inputListForTrialInEState];
    list.splice(index, 1);
    setInputListForTrialInEState(list);
    // handleDisableState();
  }
  function onSelectDesign(designId) {
    const designLabel = designs.find((design) => design.value === designId);
    setTrial(() => ({ ...trial, design: designLabel.label, designId }));
    // handleDisableState();
  }

  function onSelectType(type) {
    setTrial(() => ({ ...trial, type }));
  }

  function onSelectEstate(estate) {
    setTrial(() => ({ ...trial, estate }));
    // handleDisableState();
  }
  async function handleDisableState() {
    console.log(trial);
    console.log({ radioInputForSameDensity });
    if (radioInputForSameDensity === "no") {
      delete trial["density"];
    }

    console.log({ trial });
    const isEmpty = checkProperties(trial);

    if (radioInputForTrialInEState === "no") {
      // trial.nofreplicate = "";
      const trialToCheck = { ...trial };
      delete trialToCheck["nofreplicate"];
      delete trialToCheck["estate"];
      const isEmptyTrial = checkProperties(trialToCheck);
      let isEmptyreplicatesInEstate = false;
      inputListForTrialInEState.forEach((rpEs) => {
        isEmptyreplicatesInEstate = checkProperties(rpEs);
      });
      if (isEmptyTrial || !isMultplicationValid || isEmptyreplicatesInEstate) {
        setDisabledGenerateTable(true);
      } else {
        setDisabledGenerateTable(false);
      }
    } else {
      if (isEmpty || !isMultplicationValid) {
        setDisabledGenerateTable(true);
      } else {
        setDisabledGenerateTable(false);
      }
    }
  }
  function onGenerateTable() {
    setTableData([]);

    if (radioInputForTrialInEState === "yes") {
      const noOfReplicates = parseInt(trial.nofreplicate);
      for (let replicate = 0; replicate < noOfReplicates; replicate++) {
        const item = {
          estateId: trial.estate,
          estate: getEstateName(trial.estate),
          replicate: replicate + 1,
          estateblock: "",
          density: trial.density,
          design: trial.design,
          designId: trial.designId,
          soiltype: "",
        };
        console.log(item);
        setTableData((oldtableData) => [...oldtableData, item]);
      }
    } else {
      console.log(inputListForTrialInEState);
      for (let i = 0; i < inputListForTrialInEState.length; i++) {
        const noOfReps = parseInt(
          inputListForTrialInEState[i].estatenofreplicate
        );
        console.log({ noOfReps });
        for (let replicate = 0; replicate < noOfReps; replicate++) {
          const item = {
            estateId: inputListForTrialInEState[i].estate,
            estate: getEstateName(inputListForTrialInEState[i].estate),
            replicate: replicate + 1,
            estateblock: "",
            density: trial.density,
            design: trial.design,
            designId: trial.designId,
            soiltype: "",
          };
          console.log(item);
          setTableData((oldtableData) => [...oldtableData, item]);
        }
      }
    }
    setDisbaledANR(false);
  }

  function getEstateName(id) {
    const noOfestates = [...estates];
    console.log({ noOfestates }, { id });
    const est = noOfestates.find((est) => est.value === id);
    return est.label;
  }
  function checkProperties(obj) {
    for (var key in obj) {
      if (obj[key] === null || obj[key] === "") return true;
    }
    return false;
  }
  // GENERATE TABLE FUNCTIONS

  let checked = false;
  let indeterminate = false;
  const replicates = parseInt(trial.nofreplicate);
  if (checkStatusReplicates.length === replicates) {
    checked = true;
  } else if (checkStatusReplicates.length === 0) {
    checked = false;
  } else if (
    checkStatusReplicates.length > 0 &&
    checkStatusReplicates.length < replicates
  ) {
    indeterminate = true;
  }

  const CheckCell = ({ rowData, onChange, checkedKeys, dataKey, ...props }) => (
    <Cell {...props} style={{ padding: 0 }}>
      {(rowData, i) => {
        return (
          <>
            <div>
              <Checkbox
                value={i}
                inline
                onChange={onChange}
                checked={checkedKeys.some((item) => item === i)}
              />
            </div>
          </>
        );
      }}
    </Cell>
  );

  const handleCheckAllReplicates = (value, checked) => {
    const keys = checked ? tableData.map((item, i) => i) : [];
    setCheckStatusReplicate(keys);
  };

  const handleCheckReplicates = (value, checked) => {
    const keys = checked
      ? [...checkStatusReplicates, value]
      : checkStatusReplicates.filter((item) => item !== value);
    const values = keys.map((item, index) => {
      if(tableData[item] !== null || tableData[item] !== undefined) {
        return tableData[item]['replicate']
      }
      else {
        return 
      }
    })  
    setReplicateValue(values)
    setCheckStatusReplicate(keys);
    setDisbaledANRV(!checked);
    setDisbaledRD(!checked);
  };

  function getEstateBlocks(estate) {
    let estateBlocks = ebList.find((row) => row.estate === estate);
    const assignedEstateBlocks = [];
    if (estateBlocks) {
      estateBlocks = estateBlocks.estateblocks;
      estateBlocks.forEach((eb) => {
        if (eb.assigned) {
          assignedEstateBlocks.push(eb);
        }
      });
      // setEstateblocks(estateBlocks)
    }
    const mappedEstateBlocks = [];
    for (let item in assignedEstateBlocks) {
      mappedEstateBlocks.push({
        label: assignedEstateBlocks[item].estateblock,
        value: assignedEstateBlocks[item].estateblock,
      });
    }
    return mappedEstateBlocks;
  }

  function handleEstateBlockChange(block, estate, rowIndex) {
    if (block) {
      let estateBlocks = ebList.find((row) => row.estate === estate);

      const assignedEstateBlocks = [];
      if (estateBlocks) {
        estateBlocks = estateBlocks.estateblocks;
        estateBlocks.forEach((eb) => {
          if (eb.assigned) {
            assignedEstateBlocks.push(eb);
          }
        });
      }
      // const estateBlocksItems = [];
      // estatesWithBlocks.forEach((estate) => {
      //   estateBlocksItems.push(...estate.estateblocks);
      // });
      // const estateBlocks = [
      //   ...new Set(
      //     estateBlocksItems
      //       .map((item) => item.estateblock)
      //       .map((block) =>
      //         estateBlocksItems.find((eb) => eb.estateblock === block)
      //       )
      //   ),
      // ];

      const foundedBlock = assignedEstateBlocks.find(
        (eb) => eb.estateblock === block
      );
      const data = [...tableData];
      data[rowIndex].estateblock = block;
      data[rowIndex].blockId = foundedBlock.id;
      data[rowIndex].soiltype = foundedBlock.soiltype;
      setTableData(data);
    } else {
      const data = [...tableData];
      data[rowIndex].estateblock = block;
      setTableData(data);
    }
  }
  function onAddingNewReplicate() {
    const data = [...tableData];
    let replicateObj = data[data.length - 1];
    const newRep = {
      estate: replicateObj.estate,
      replicate: parseInt(replicateObj.replicate) + 1,
      estateblock: replicateObj.estateblock,
      density: replicateObj.density,
      design: replicateObj.design,
      soiltype: replicateObj.soiltype,
    };
    data[data.length] = newRep;
    const currentnoOfRep =
      trial.nofreplicate !== "" ? parseInt(trial.nofreplicate) : 0;
    const updatednoOfRep = currentnoOfRep + 1;
    setTrial(() => ({ ...trial, nofreplicate: updatednoOfRep.toString() }));
    setTableData(data);
  }
  function onAddingNewReplicateVarient() {
    console.log(checkStatusReplicates);
    const data = [...tableData];
    console.log(data);
    for (let index in checkStatusReplicates) {
      console.log(checkStatusReplicates[index]);
      const repIndex = checkStatusReplicates[index];
      const existingRep = data[repIndex];
      const variant = {
        estateId: existingRep.estateId,
        estate: existingRep.estate,
        replicate: existingRep.replicate,
        estateblock: existingRep.estateblock,
        density: existingRep.density,
        design: existingRep.design,
        soiltype: existingRep.soiltype,
        isvariant: true,
      };

      data.splice(repIndex + 1, 0, variant);
      setTableData(data);
      console.log(existingRep);
    }
  }

  function deleteReplicate() {
    let data = tableData
    //const data = [...tableData];
    //console.log(replicateValue)
    // for (let index in checkStatusReplicates) {
    //   data.splice(checkStatusReplicates[index], 1);
    //   checkStatusReplicates.splice(index, 1);
    // }
    // setTableData(data);
    replicateValue.map((item, index) => {
      data = data.filter(item2 => item2['replicate'] !== item)
      return data
    })
    setCheckStatusReplicate([]);
    setTableData(data);
  }

  function onSaveTrial() {
    const {user}   =  authData;
    trial["replicates"] = tableData;
    console.log(trial, user);
    trial["trialId"] = null;
    trial["createdBy"] = user.username;
    trial["createdDate"] = new Date();
    delete trial.estate;
    TrialService.saveTrial(trial).then(
      (data) => {
        const savedData = {
          type: "TRIAL",
          data: trial,
          action: "CREATED",
        };
        setShow(false);
        dispatch(getDashboardData("trial"));
        setSuccessData(savedData);
        setSuccessModal(true);
      },
      (err) => console.log(err)
    );
  }

  function hide() {
    setShow(false);
  }

  function CloseSuccessModal() {
    setSuccessModal(false);
    dispatch(clearBreadcrumb());
  }
  return (
    <div id="TrialAction">
      {/* STEP 1 GENERATE TABLE START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 1:</span>{" "}
          <span className="purpose">Generate Table</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial ID</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial ID"
              className="formField"
              name="trialCode"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          {/* <Col>
            {trial.trialCode === "" ? (
              <Tag color="red">Trial Code is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Type</p>
          </Col>
          <Col md={10} lg={10}>
            <SelectPicker
              id="type"
              className="designPicker"
              data={trialTypes}
              onSelect={(type) => onSelectType(type)}
              placeholder="Select Type"
              block
            />{" "}
          </Col>
          {/* <Col>
            {trial.type === "" ? (
              <Tag color="red">Trial type is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Trial "
              className="formField"
              name="trial"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          {/* <Col>
            {trial.trial === "" ? (
              <Tag color="red">Trial is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>
        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Trial Remarks</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              componentClass="textarea"
              rows={3}
              placeholder="Key In Trial Remarks"
              className="formField trialRemark"
              name="trialremark"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          {/* <Col>
            {trial.trialremark === "" ? (
              <Tag color="red">Trial Remark is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Area (ha)</p>
          </Col>
          <Col md={10} lg={10}>
            <Input
              placeholder="Key in Area"
              className="formField"
              name="area"
              type="number"
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          {/* <Col>
            {trial.area === "" ? (
              <Tag color="red">Trial Area is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">Planted Date</p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <DatePicker
              size="lg"
              className="datePicker"
              placeholder="Enter Date"
              format="MM/YYYY"
              style={styles}
              name="planteddate"
              onSelect={(date) =>
                setTrial(() => ({ ...trial, planteddate: date }))
              }
            />
          </Col>
          {/* <Col>
            {trial.planteddate === "" ? (
              <Tag color="red">Trial planted date is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">No. of Progeny</p>
          </Col>
          <Col md={10} lg={10}>
            <InputNumber
              placeholder="Key in No.of Progeny"
              className="formField"
              name="nofprogeny"
              min="1"
              step="1"
              value={trial.nofprogeny}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          {/* <Col>
            {trial.nofprogeny === 0 || trial.nofprogeny === ""? (
              <Tag color="red">Trial No of Progenies is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">No. of Subblock and No.of Plot/Subblock</p>
          </Col>
          <Col md={5} lg={5}>
            <InputNumber
              placeholder="No. of Subblock"
              className="subPlotInput"
              name="nofsubblock"
              min="1"
              step="1"
              value={trial.nofsubblock}
              onChange={(value, e) => onInput(e)}
            />
          </Col>
          <Col md={5} lg={5}>
            <InputNumber
              placeholder="No. of Plot/Subblock "
              className="plotInput"
              name="nofplot_subblock"
              min="1"
              step="1"
              value={trial.nofplot_subblock}
              onChange={(value, e) => onInput(e)}
            />
            {isMultplicationValid === false ? (
              <>
                <p style={{ color: "red", fontSize: "12px" }}>
                  Multiplication of No. of Subblock and No. of Plot/Subblock
                  must be equal to No. of Progeny.{" "}
                </p>
              </>
            ) : (
              ""
            )}
          </Col>
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">This Trial will be in the same Estate?</p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <RadioGroup
              name="radioList"
              value={radioInputForTrialInEState}
              onChange={(value) => {
                onRadioInputTrialInEState(value);
              }}
              inline
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </Col>
          {radioInputForTrialInEState === "yes" ? (
            <Col md={5} lg={5}>
              <SelectPicker
                id="estate"
                className="estatePicker"
                data={estates}
                placeholder="Select Estate"
                onSelect={(estate) => onSelectEstate(estate)}
                block
              />{" "}
            </Col>
          ) : (
            ""
          )}
        </Row>
        {radioInputForTrialInEState === "no" ? (
          <Row className="show-grid TrialFormLayout">
            {inputListForTrialInEState.map((input, i) => (
              <>
                <div key={i}>
                  <Col xs={12} style={{ width: "100%" }}>
                    <Col md={9} lg={8}>
                      {i < 1 ? (
                        <p className="labelForm">
                          No. of Replicates in Each Estate
                        </p>
                      ) : (
                        ""
                      )}
                    </Col>
                    <Col md={5} lg={5}>
                      <SelectPicker
                        className="estatePickerwithNo"
                        data={estates}
                        placeholder="Select Estate"
                        value={input.estate}
                        onChange={(value, event) =>
                          handleTrialInEStateInputChange(value, i, "select")
                        }
                        block
                      />
                    </Col>
                    <Col md={5} lg={5}>
                      <InputNumber
                        placeholder="Select No of Replicate"
                        className="replicateInput"
                        name="estatenofreplicate"
                        value={input.estatenofreplicate}
                        onChange={(value, e) =>
                          handleTrialInEStateInputChange(e, i, "input")
                        }
                      />
                    </Col>
                    <IconButton
                      icon={<Icon icon="plus" />}
                      circle
                      color="green"
                      size="sm"
                      onClick={onAddTrialInEstate}
                    />
                    &nbsp;
                    {i > 0 ? (
                      <IconButton
                        icon={<Icon icon="close" />}
                        circle
                        color="red"
                        size="sm"
                        onClick={() => onRemoveTrialInEstate(i)}
                      />
                    ) : (
                      ""
                    )}
                  </Col>
                </div>
              </>
            ))}
          </Row>
        ) : (
          ""
        )}
        {radioInputForTrialInEState === "yes" ? (
          <Row className="show-grid TrialFormLayout">
            <Col md={9} lg={8}>
              <p className="labelForm">No. of Replicates</p>
            </Col>
            <Col md={10} lg={10}>
              <Input
                placeholder="Enter Number of Replicate for this Trial"
                className="formField"
                name="nofreplicate"
                value={trial.nofreplicate}
                onChange={(value, e) => onInput(e)}
              />
            </Col>
            {/* <Col>
            {trial.nofreplicate === "" ? (
              <Tag color="red">Trial no of replicate is Required!</Tag>
            ) : null}
          </Col> */}
          </Row>
        ) : (
          ""
        )}

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">
              Do all replicates have the same density?
            </p>
          </Col>
          <Col md={5} lg={5}>
            {" "}
            <RadioGroup
              name="radioList"
              value={radioInputForSameDensity}
              onChange={(value) => {
                onRadioInputSameDensity(value);
              }}
              inline
            >
              <Radio value="yes">Yes</Radio>
              <Radio value="no">No</Radio>
            </RadioGroup>
          </Col>
          {radioInputForSameDensity === "yes" ? (
            <Col md={5} lg={5}>
              <Input
                placeholder="Enter Density"
                name="density"
                type="number"
                className="densityInput"
                onChange={(value, e) => onInput(e)}
              />
              {/* {trial.density === "" ? (
              <Tag color="red">Trial density is Required!</Tag>
            ) : null} */}
            </Col>
          ) : (
            ""
          )}
        </Row>

        <Row className="show-grid TrialFormLayout">
          <Col md={9} lg={8}>
            <p className="labelForm">What is the design for the replicates ?</p>
          </Col>
          <Col md={10} lg={10}>
            <SelectPicker
              id="design"
              className="designPicker"
              data={designs}
              onSelect={(design) => onSelectDesign(design)}
              placeholder="Choose Design"
              block
            />{" "}
          </Col>
          {/* <Col>
            {trial.design === "" ? (
              <Tag color="red">Trial Design is Required!</Tag>
            ) : null}
          </Col> */}
        </Row>
      </Grid>

      <div className="buttonLayout">
        <Button
          appearance="primary"
          className="generateTableButton"
          onClick={onGenerateTable}
          disabled={disabledGenerateTable}
        >
          <Icon icon="table" /> Generate Table
        </Button>
      </div>
      {/* STEP 1 GENERATE TABLE END */}
      <hr className="lineBetweenStep" />

      {/* STEP 2 CUSTOMISE TABLE START*/}
      <div>
        <h4 className="title">
          <span className="desc">Step 2:</span>{" "}
          <span className="purpose">Customise Table</span>
        </h4>
      </div>

      <Grid fluid>
        <Row className="show-grid TrialFormLayout">
          <FlexboxGrid justify="end">
            <Col md={5} lg={4}>
              <FlexboxGrid.Item>
                <div className="buttonLayout">
                  <Button
                    appearance="primary"
                    className="replicateButton"
                    onClick={onAddingNewReplicate}
                    disabled={disbaledANR}
                  >
                    Add New Replicate
                  </Button>
                </div>
              </FlexboxGrid.Item>
            </Col>
            <Col md={5} lg={4}>
              <FlexboxGrid.Item>
                <div className="buttonLayout">
                  <Button
                    appearance="primary"
                    className="variant variantButton"
                    onClick={onAddingNewReplicateVarient}
                    disabled={disbaledANRV}
                  >
                    Add Replicate Variant
                  </Button>
                </div>
              </FlexboxGrid.Item>
            </Col>
            <Col md={4} lg={3}>
              <FlexboxGrid.Item>
                <div className="buttonLayout">
                  <Button
                    className="deleteButton"
                    onClick={deleteReplicate}
                    disabled={disbaledRD}
                  >
                    Delete
                  </Button>
                </div>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>

      <Table id="dashboardTable" wordWrap data={tableData} autoHeight>
        <Column width={70} align="center" fixed>
          <HeaderCell className="tableHeader">
            <Checkbox
              checked={checked}
              indeterminate={indeterminate}
              onChange={handleCheckAllReplicates}
            />
          </HeaderCell>
          <CheckCell
            dataKey="replicate"
            checkedKeys={checkStatusReplicates}
            onChange={handleCheckReplicates}
          />
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Estate</HeaderCell>
          <Cell dataKey="estate">
            {(rowData) => {
              return (
                <>
                  {!rowData.isvariant ? (
                    <Input value={rowData.estate} disabled />
                  ) : (
                    ""
                  )}
                </>
              );
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Replicate</HeaderCell>
          <Cell dataKey="replicate">
            {(rowData) => {
              return (
                <>
                  {!rowData.isvariant ? (
                    <Input value={rowData.replicate} disabled />
                  ) : (
                    <img src={SubDirectoryIcon} style={{ margin: "0 50%" }} />
                  )}
                </>
              );
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Estate Block </HeaderCell>
          <Cell>
            {(rowData, i) => {
              return (
                <SelectPicker
                  data={getEstateBlocks(rowData.estate)}
                  style={{ width: 224 }}
                  placeholder="-"
                  value={rowData.estateblock}
                  onChange={(value, event) =>
                    handleEstateBlockChange(value, rowData.estate, i)
                  }
                />
              );
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Density</HeaderCell>
          <Cell>
            {(rowData) => {
              return <Input value={rowData.density} />;
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Design</HeaderCell>
          <Cell>
            {(rowData) => {
              return <Input value={rowData.design} disabled />;
            }}
          </Cell>
        </Column>

        <Column width={200} align="left">
          <HeaderCell className="tableHeader">Soil Type</HeaderCell>
          <Cell>
            {(rowData) => {
              return (
                <Input value={rowData.soiltype} disabled placeholder="-" />
              );
            }}
          </Cell>
        </Column>
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
            <Col md={5} lg={4} className="completeButtonLayout">
              <FlexboxGrid.Item>
                <Button
                  className="saveButton"
                  appearance="primary"
                  onClick={() => setShow(true)}
                  type="button"
                >
                  Save
                </Button>
              </FlexboxGrid.Item>
            </Col>
          </FlexboxGrid>
        </Row>
      </Grid>
      {/* STEP 2 CUSTOMISE TABLE END*/}

      {/* CONFIRMATION MODEL START */}
      <Modal id="SaveTrialModal" show={show} onHide={hide}>
        <Modal.Header>
          <Modal.Title className="title">Saving Trial</Modal.Title>
        </Modal.Header>
        <Modal.Body className="body">
          Are you sure you want to save this{" "}
          <span className="description">Trial {trial.trialCode}</span> ? This
          Trial and it’s replicate will be created inside the system.
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={hide} className="yesButton" appearance="subtle">
            No
          </Button>
          <Button
            onClick={onSaveTrial}
            className="noButton"
            appearance="primary"
          >
            Yes
          </Button>
        </Modal.Footer>
      </Modal>
      {/* CONFIRMATION MODEL END */}

      <SuccessModal
        show={isSuccessModal}
        hide={CloseSuccessModal}
        data={successData}
      />
    </div>
  );
};
export default AddNewTrial;
