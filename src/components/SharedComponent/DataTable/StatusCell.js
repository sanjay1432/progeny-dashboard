import { Button } from 'rsuite'

const StatusCell = ({ status }) => {
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

export default StatusCell