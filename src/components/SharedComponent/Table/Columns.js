const Columns = ( active ) => {
  switch (active) {
    case "estate":
      const columns_estate = [
        {
          name: "Estate",
          dataKey: "estate",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Estate Full Name",
          dataKey: "estatefullname",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "No of Estate Block",
          dataKey: "noofestateblock",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "No trials on this Estate",
          dataKey: "nooftrails",
          flexGrow: 1,
          sorting: true
        }
      ]
      return columns_estate
    case "trial":
      const columns_trial = [
        {
          name: "Trial ID",
          dataKey: "trialCode",
          width: 120,
          sorting: true
        },
        {
          name: "Type",
          dataKey: "type",
          width: 200,
          sorting: true
        },
        {
          name: "Trial",
          dataKey: "trial",
          width: 200,
          sorting: true
        },
        {
          name: "Trial Remarks",
          dataKey: "trialremark",
          width: 500,
          sorting: true
        },
        {
          name: "Area (ha)",
          dataKey: "area",
          width: 300,
          sorting: true
        },
        {
          name: "Planted Date",
          dataKey: "planteddate",
          width: 200,
          sorting: true
        },
        {
          name: "n Progeny",
          dataKey: "nofprogeny",
          width: 120,
          sorting: true
        },
        {
          name: "Estate",
          dataKey: "estate",
          width: 120
        },
        {
          name: "n Of Replicate",
          dataKey: "nofreplicate",
          width: 140,
          sorting: true
        },
        {
          name: "n Of Plot",
          dataKey: "nofplot",
          width: 120,
          sorting: true
        },
        {
          name: "n Of Subblock/Rep",
          dataKey: "nofsubblock",
          width: 170,
          sorting: true
        },
        {
          name: "n Of Plot/subblock",
          dataKey: "nofplot_subblock",
          width: 170,
          sorting: true
        },
        {
          name: "Status",
          dataKey: "status",
          width: 130,
          align: "center",
          fixed: "right",
          sorting: true
        }
      ]
      return columns_trial
    case "plot":
      const columns_plot = [
        {
          name: "Trial ID",
          dataKey: "trialCode",
          width: 140,
          sorting: true
        },
        {
          name: "Estate",
          dataKey: "estate",
          width: 140,
          sorting: true
        },
        {
          name: "Trial",
          dataKey: "trial",
          width: 140,
          sorting: true
        },
        {
          name: "Estate Block",
          dataKey: "estateblock",
          width: 140,
          sorting: true
        },
        {
          name: "Design",
          dataKey: "design",
          width: 140,
          sorting: true
        },
        {
          name: "Density",
          dataKey: "density",
          width: 140,
          sorting: true
        },
        {
          name: "Plot",
          dataKey: "plot",
          width: 140,
          sorting: true
        },
        {
          name: "Estate",
          dataKey: "estate",
          width: 140
        },
        {
          name: "Subblock",
          dataKey: "subblock",
          width: 140,
          sorting: true
        },
        {
          name: "Progeny ID",
          dataKey: "progenyCode",
          width: 140,
          sorting: true
        },
        {
          name: "Progeny",
          dataKey: "progeny",
          width: 120,
          sorting: true
        },
        {
          name: "Ortet",
          dataKey: "ortet",
          width: 140,
          sorting: true
        },
        {
          name: "FP",
          dataKey: "fp",
          width: 140,
          sorting: true
        },
        {
          name: "MP",
          dataKey: "mp",
          width: 140,
          sorting: true
        },
        {
          name: "nPalm",
          dataKey: "noofPalm",
          width: 140,
          sorting: true
        }
      ]
      return columns_plot
    case "palm":
      const columns_palm = [
        {
          name: "Trial ID",
          dataKey: "trialCode",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Estate",
          dataKey: "estate",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Replicate",
          dataKey: "replicateno",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Estate Block",
          dataKey: "estateblock",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Plot",
          dataKey: "plot",
          flexGrow: 1,
          sorting: true
        },
        {
          name: "Palm Number",
          dataKey: "palmno",
          flexGrow: 1,
          sorting: true
        }
      ]
      return columns_palm
    case "progeny":
      const columns_progeny = [
        {
          name: "Progeny ID",
          dataKey: "progenyCode",
          width: 200,
          sorting: true
        },
        {
          name: "Pop Var",
          dataKey: "popvar",
          width: 170,
          sorting: true
        },
        {
          name: "Origin",
          dataKey: "origin",
          width: 200,
          sorting: true
        },
        {
          name: "Progeny Remark",
          dataKey: "progenyremark",
          width: 200,
          sorting: true
        },
        {
          name: "Progeny",
          dataKey: "progeny",
          width: 150,
          sorting: true
        },
        {
          name: "Generation",
          dataKey: "generation",
          width: 170,
          sorting: true
        },
        {
          name: "Ortet",
          dataKey: "orter",
          width: 170,
          sorting: true
        },
        {
          name: "FP",
          dataKey: "fp",
          width: 150,
          sorting: true
        },
        {
          name: "FP Fam",
          dataKey: "fpFam",
          width: 150,
          sorting: true
        },
        {
          name: "FP Var",
          dataKey: "fpVar",
          width: 150,
          sorting: true
        },
        {
          name: "MP",
          dataKey: "mp",
          width: 150,
          sorting: true
        },
        {
          name: "MP Fam",
          dataKey: "mpFam",
          width: 150,
          sorting: true
        },
        {
          name: "MP Var",
          dataKey: "mpVar",
          width: 150,
          sorting: true
        },
        {
          name: "Cross",
          dataKey: "cross",
          width: 200,
          sorting: true
        },
        {
          name: "Cross Type",
          dataKey: "crossType",
          width: 200,
          sorting: true
        }
      ]
      return columns_progeny
    case "yearlyverification":
      const columns_yearly = [
        {
          name: "Trial ID",
          dataKey: "trialCode",
          flexGrow: 1,
        },
        {
          name: "Trial",
          dataKey: "trial",
          flexGrow: 1,
        },
        {
          name: "Form",
          dataKey: "form",
          flexGrow: 1,
        },
        {
          name: "UploadedDate",
          dataKey: "uploadedDate",
          flexGrow: 1,
        },
        {
          name: "Uploaded By",
          dataKey: "uploadedBy",
          flexGrow: 1,
        },
        {
          name: "Record Date",
          dataKey: "recordDate",
          flexGrow: 1,
        },
        {
          name: "Recorded By",
          dataKey: "recordedBy",
          flexGrow: 1,
        }
      ]
      return columns_yearly
    case "verifyforms":
      const columns_verify = [
        {
          name: "Trial ID",
          dataKey: "trialCode",
          flexGrow: 1,
        },
        {
          name: "Trial",
          dataKey: "trial",
          flexGrow: 1,
        },
        {
          name: "Form",
          dataKey: "form",
          flexGrow: 1,
        },
        {
          name: "UploadedDate",
          dataKey: "uploadedDate",
          flexGrow: 1,
        },
        {
          name: "Uploaded By",
          dataKey: "uploadedBy",
          flexGrow: 1,
        },
        {
          name: "Record Date",
          dataKey: "recordDate",
          flexGrow: 1,
        },
        {
          name: "Recorded By",
          dataKey: "recordedBy",
          flexGrow: 1,
        }
      ]
      return columns_verify
    default:
      return null;  
  }
}

export default Columns