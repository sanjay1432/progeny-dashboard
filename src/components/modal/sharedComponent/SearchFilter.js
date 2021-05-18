import { Button, Grid, Row, Col } from "rsuite"
import Filter from "./Filter"

const SearchFilter = () => {
  return (
    <>
      <Grid fluid>
        <Row>
          <Col md={8} lg={8}>
            <Filter className="filter" />
          </Col>
          <Col md={8} lg={8}>
            <Button appearance="primary" className="btnApply">
              Apply
            </Button>
          </Col>
          <Col md={8} lg={8}>
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
