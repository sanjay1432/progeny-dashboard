import GeneralHelper from "../../../helper/general.helper";
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
const { Column, HeaderCell, Cell } = Table;


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
  function getMultipleEstateString(estates) {
    let estateString = "";
    estates.forEach((element, idx) => {
      const pipe = estates.length - idx > 1 ? "|" : "";
      estateString += ` ${element.name} ${pipe}`;
    });

    return estateString;
  }

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
                "replicateno",
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

export default EditableCell