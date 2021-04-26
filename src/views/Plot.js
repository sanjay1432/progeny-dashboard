import React, { useState, useEffect } from "react"
import CropFreeRoundedIcon from "@material-ui/icons/CropFreeRounded"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import LinkRoundedIcon from "@material-ui/icons/LinkRounded"
import DataTable from "../components/table/Table"
import { Table } from "rsuite"
const { Cell } = Table

const Plot = () => {
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
      name: "Design",
      dataKey: "id",
      width: 200
    },
    {
      name: "Density",
      dataKey: "title",
      width: 200
    },
    {
      name: "Plot",
      dataKey: "content",
      width: 200
    },
    {
      name: "subblock",
      dataKey: "",
      width: 200
    },
    {
      name: "Progeny ID",
      dataKey: "id",
      width: 200
    },
    {
      name: "Progeny",
      dataKey: "title",
      width: 200
    },
    {
      name: "Ortet",
      dataKey: "content",
      width: 200
    },
    {
      name: "FP",
      dataKey: "",
      width: 200
    },
    {
      name: "MP",
      dataKey: "id",
      width: 200
    },
    {
      name: "nPalm",
      dataKey: "title",
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
      <CropFreeRoundedIcon />
      <EditRoundedIcon />
      <LinkRoundedIcon />
    </Cell>
  )

  return (
    <div style={{ width: 1024 }}>
      <DataTable columns={COLUMNS} data={data} />
    </div>
  )
}

export default Plot
