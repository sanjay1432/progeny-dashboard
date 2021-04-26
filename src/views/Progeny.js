//import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import React, { useState, useEffect } from "react"
import EditRoundedIcon from "@material-ui/icons/EditRounded"
import DataTable from "../components/table/Table"
import { Table } from "rsuite"
const { Cell } = Table

const Progeny = () => {
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
      name: "Progeny ID",
      dataKey: "id",
      width: 200
    },
    {
      name: "Pop Var",
      dataKey: "title",
      width: 200
    },
    {
      name: "Origin",
      dataKey: "content",
      width: 200
    },
    {
      name: "Progeny Remark",
      dataKey: "",
      width: 200
    },
    {
      name: "Progeny",
      dataKey: "id",
      width: 200
    },
    {
      name: "Generation",
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
      name: "FP Fam",
      dataKey: "title",
      width: 200
    },
    {
      name: "FP Var",
      dataKey: "content",
      width: 200
    },
    {
      name: "MP",
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
      <EditRoundedIcon />
    </Cell>
  )

  return (
    <div style={{ width: 1024 }}>
      <DataTable columns={COLUMNS} data={data} />
    </div>
  )
}

export default Progeny
