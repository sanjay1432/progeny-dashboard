import { Button, Grid, Row, Col } from "rsuite"
import Search from "./Search"
import Filter from "./Filter"

const SearchFilter = () => {
  return (
    <Grid>
      <Row>
        <Col>
          <Search />
        </Col>
        <Col>
          <Filter />
        </Col>
        <Col>
          <Button>Apply</Button>
        </Col>
        <Col>
          <Button>Reset Filter</Button>
        </Col>
      </Row>
    </Grid>
  )
}

export default SearchFilter
