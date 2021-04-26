//import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useState, useEffect } from "react"
import OpenInNewRoundedIcon from "@material-ui/icons/OpenInNewRounded"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import LinkRoundedIcon from "@material-ui/icons/LinkRounded"
import Table from "../components/table/Table"
import { Table } from "rsuite"
const { Cell } = Table

const TrialAndReplicate = () => {
  const [data, setData] = useState([])

  const loadData = async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts")
    setData(await res.json())
  }

  useEffect(() => {
    loadData()
    return () => {}
  }, [])

  console.log(data)

  const COLUMNS = [
    {
      name: "",
      dataKey: "id",
      width: 200,
      customCell: CheckCell
    },
    {
      name: "Trial ID",
      dataKey: "",
      width: 200
    },
    {
      name: "Trial",
      dataKey: "",
      width: 200
    },
    {
      name: "Trial Remarks",
      dataKey: "",
      width: 200
    },
    {
      name: "Area(ha)",
      dataKey: "",
      width: 200
    },
    {
      name: "Planted Date",
      dataKey: "id",
      width: 200
    },
    {
      name: "n Progent",
      dataKey: "title",
      width: 200
    },
    {
      name: "Estate",
      dataKey: "content",
      width: 200
    },
    {
      name: "n of Replicate",
      dataKey: "",
      width: 200
    },
    ,
    {
      name: "Soil Type",
      dataKey: "",
      width: 200
    },
    {
      name: "n of Plot",
      dataKey: "id",
      width: 200
    },
    {
      name: "n of Subblock/Rep",
      dataKey: "title",
      width: 200
    },
    {
      name: "n of Plot/subblock",
      dataKey: "content",
      width: 200
    },
    {
      name: "Status",
      dataKey: "",
      width: 200
    },
    {
      name: "Action",
      dataKey: "",
      customCell: ActionCell,
      width: 200
    }
  ]

  const CheckCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <input type="checkbox" id="id" value={rowData[dataKey]} />
    </Cell>
  )

  const ActionCell = ({ rowData, dataKey, ...props }) => (
    <Cell {...props}>
      <OpenInNewRoundedIcon />
      <EditRoundedIcon />
      <LinkRoundedIcon />
    </Cell>
  )

  return (
    <div style={{ width: 1024 }}>
      <Table columns={COLUMNS} data={data} />
    </div>
  )
}

export default TrialAndReplicate
