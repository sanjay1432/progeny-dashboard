import { Button, ControlLabel, Grid, Row, Col } from "rsuite"
import Filter from "./Filter"

let FilterData = {}
const SearchFilter = () => {
  return (
    <>
      <Grid fluid>
        <Row>
          <Col md={7} lg={7}>
            <ControlLabel>Estate</ControlLabel>
            <Filter />
          </Col>
          <Col md={5} lg={5}>
            <Button appearance="primary" className="btnApply">
              Apply
            </Button>
          </Col>
          <Col md={5} lg={5}>
            <Button appearance="subtle" className="btnResetFilter">
              Reset Filter
            </Button>
          </Col>
        </Row>
      </Grid>
    </>
  )
}

export default SearchFilter
