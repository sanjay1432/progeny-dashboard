import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearBreadcrumb } from "../../redux/actions/app.action";
import { Grid, Row, Col, Input, Button } from "rsuite";
import ConfirmationModal from "../SharedComponent/ConfirmationModal";
import ErrorMessage from "../SharedComponent/ErrorMessage";
import DataPicker from "../SharedComponent/DataPicker";
import ProgenyService from "../../services/progeny.service";
import { publish } from "../../services/pubsub.service";
import { getDashboardData } from "../../redux/actions/dashboarddata.action"
const AddNewProgeny = () => {
  const initialForm = {
    progenyCode: "",
    popvar: "",
    origin: "",
    progenyremark: "",
    progeny: "",
    generation: "",
    ortet: "",
    fpFam: "",
    fp: "",
    fpVar: "",
    mpFam: "",
    mp: "",
    mpVar: "",
    cross: "",
    crossType: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const [confirmationModal, setConfirmationModal] = useState(false);

  const [dupProps, setDupProps] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const dispatch = useDispatch();

  const ProgenyData = useSelector(
    (state) => state.dashboardDataReducer.result.progeny
  );

  const data = [
    {
      crossType: "sibbing",
    },
    {
      crossType: "selfing",
    },
    {
      crossType: "intercross",
    },
  ];

  const crossTypeData = data.map((item) => {
    const addOn = formData.fpVar + "x" + formData.mpVar + " ";
    return addOn.concat(item.crossType);
  });

  function handleChange(e) {
    //CHECK FOR EXISTING PROGENY ID
    checkDups(e.target.value);
    e.persist();
    setFormData(() => ({ ...formData, [e.target.name]: e.target.value.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '') }));
  }

  function checkDups(value) {
    const found = ProgenyData.find(
      (pd) => pd.progenyCode.toLowerCase() === value.toLowerCase()
    );
    const isDuplicate = found ? true : false;
    setDupProps(isDuplicate);
  }
  function handleFpChange(e) {
    e.persist();
    setFormData(() => ({
      ...formData,
      fp: formData.fpFam + "." + e.target.value,
    }));
  }

  function handleMpChange(e) {
    e.persist();
    setFormData(() => ({
      ...formData,
      mp: formData.mpFam + "." + e.target.value,
      cross: formData.fp + " x " + formData.mp,
    }));
  }

  function createProgeny() {
    const payload = {
      ...formData,
      cross: formData.fp + " x " + formData.mp
    }

    ProgenyService.createProgeny(payload).then(
      (data) => {
        const savedData = {
          type: "PROGENY_CREATE",
          data: payload,
          action: "CREATE",
        };
        dispatch(getDashboardData('progeny'))
        dispatch(clearBreadcrumb());
        publish(savedData);
      },
      (error) => {
        setConfirmationModal(false);
        setErrorMessage(true);
      }
    );
  }

  function checkDisableState() {
    const length = Object.keys(formData).length;
    const filled = Object.keys(formData).filter(
      (key, index) => formData[key] != ""
    );
    return length === filled.length && !dupProps;
  }
  return (
    <div id="ProgenyAction">
      <ConfirmationModal
        show={confirmationModal}
        hide={() => setConfirmationModal(false)}
        save={createProgeny}
        data={formData}
        action="PROGENY_CREATE"
      />
      <ErrorMessage description={`Our system has some issues, please try again later`} show={errorMessage} hide={() =>setErrorMessage(false)} />
      <Grid fluid>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny ID</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <Input
              name="progenyCode"
              value = {formData.progenyCode}
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny ID"
            />
            {dupProps ? (
              <p style={{ color: "red", fontSize: "12px", float: "right" }}>
                Progeny ID already existed *
              </p>
            ) : null}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Pop Var</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="popvar"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, popvar: value }))
              }
              placeholder="Choose or Create New Pop Var"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Origin</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <Input
              name="origin"
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Origin"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny Remark</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <Input
              name="progenyremark"
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny Remark"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Progeny</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <Input
              name="progeny"
              onChange={(value, e) => handleChange(e)}
              placeholder="Key in Progeny"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Generation</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="generation"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, generation: value }))
              }
              placeholder="Choose or Create New Generation"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Ortet</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <Input
              name="ortet"
              onChange={(value, e) => handleChange(e)}
              placeholder="key in Ortet"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Fam</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="fpFam"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, fpFam: value }))
              }
              placeholder="Choose or Create New FP Fam"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP</p>
          </Col>
          <Col md={5} lg={5} className="fpLayout">
            {formData.fpFam === "" ? (
              <Input
                className="fpFamDisplay"
                name="fp"
                placeholder="FP"
                disabled
              />
            ) : (
              <Input
                className="fpFamDisplay"
                name="fp"
                value={formData.fpFam}
                disabled
              />
            )}
          </Col>
          <Col md={5} lg={5} className="fpLayout">
            {formData.fpFam === "" ? (
              <Input
                className="fpInput"
                name="fp"
                placeholder="Palm Number"
                disabled
              />
            ) : (
              <Input
                className="fpInput"
                name="fp"
                placeholder="Palm Number"
                onChange={(value, e) => handleFpChange(e)}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">FP Var</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="fpVar"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, fpVar: value }))
              }
              placeholder="Choose or Create New FP Var"
            />
          </Col>
        </Row>

        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Fam</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="mpFam"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, mpFam: value }))
              }
              placeholder="Choose or Create New MP Fam"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP</p>
          </Col>
          <Col md={5} lg={5} className="mpLayout">
            {formData.fpFam === "" ? (
              <Input
                className="mpFamDisplay"
                name="mp"
                placeholder="MP"
                disabled
              />
            ) : (
              <Input
                className="mpFamDisplay"
                name="mfp"
                value={formData.mpFam}
                disabled
              />
            )}
          </Col>
          <Col md={5} lg={5} className="mpLayout">
            {formData.mpFam === "" ? (
              <Input
                className="mpInput"
                name="mp"
                placeholder="Palm Number"
                disabled
              />
            ) : (
              <Input
                className="mpInput"
                name="mp"
                placeholder="Palm Number"
                onChange={(value, e) => handleMpChange(e)}
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">MP Var</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            <DataPicker
              dataType="mpVar"
              searchable="true"
              OriginalData={ProgenyData}
              onChange={(value) =>
                setFormData(() => ({ ...formData, mpVar: value }))
              }
              placeholder="Choose or Create New MP Var"
            />
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            {formData.fpFam === "" ||
            formData.fp === "" ||
            formData.mpFam === "" ||
            formData.mp === "" ? (
              <Input disabled placeholder="Please choose FP and MP" />
            ) : (
              <Input
                name="cross"
                value={formData.fp + " x " + formData.mp}
                onChange={(value) =>
                  setFormData(() => ({ ...formData, cross: value }))
                }
                disabled
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col md={5} lg={5}>
            <p className="labelName">Cross Type</p>
          </Col>
          <Col md={10} lg={10} className="inputLayout">
            {formData.fpVar === "" && formData.mpVar === "" ? (
              <Input placeholder="Please choose FP Var and MP Var" disabled />
            ) : (
              <DataPicker
                dataType="crossType"
                searchable="true"
                completedData={crossTypeData}
                onChange={(value) =>
                  setFormData(() => ({ ...formData, crossType: value }))
                }
                placeholder="Choose or Create New MP Var"
              />
            )}
          </Col>
        </Row>
        <Row>
          <Col
            mdOffset={16}
            md={4}
            lgOffset={16}
            lg={4}
            className="cancelButtonLayout"
          >
            <Button
              className="cancelButton"
              appearance="subtle"
              onClick={() => dispatch(clearBreadcrumb())}
            >
              Cancel
            </Button>
          </Col>
          <Col md={4} lg={4} className="saveButtonLayout">
            <Button
              className="saveButton"
              appearance="primary"
              disabled={!checkDisableState()}
              onClick={() => setConfirmationModal(true)}
            >
              Save
            </Button>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

export default AddNewProgeny;
