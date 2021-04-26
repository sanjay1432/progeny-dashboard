//import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useState, useEffect } from "react"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import DataTable from "../components/table/Table"
import { Table } from "rsuite"
const { Cell } = Table

const Palm = () => {
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
      dataKey: "id",
      width: 200
    },
    {
      name: "Estate",
      dataKey: "title",
      width: 200
    },
    {
      name: "Replicate",
      dataKey: "content",
      width: 200
    },
    {
      name: "Estate Block",
      dataKey: "",
      width: 200
    },
    {
      name: "Plot",
      dataKey: "title",
      width: 200
    },
    {
      name: "Palm No",
      dataKey: "content",
      width: 200
    },
    {
      name: "Palm Name",
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
      <ActionIcon />
    </Cell>
  )

  return (
    <div style={{ width: 1024 }}>
      <DataTable columns={COLUMNS} data={data} />
    </div>
  )
}

export default Palm
