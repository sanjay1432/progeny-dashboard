import { Container, FlexboxGrid, Content, Panel } from "rsuite";

const AccessDenied = (props) => {
  return (
    <div className="show-fake-browser login-page">
      <Container>
        <Content style={{ margin: "201px", padding: "20px" }}>
          <FlexboxGrid justify="center">
            <FlexboxGrid.Item
              colspan={12}
              style={{ background: "#009d57", borderRadius: "5px" }}
            >
              <Panel header={<h3>Access Denied ☹</h3>} bordered>
                <h1>
                  <span>&#9888;</span> Not Authorized to access this page!{" "}
                </h1>
              </Panel>
            </FlexboxGrid.Item>
          </FlexboxGrid>
        </Content>
      </Container>
    </div>
  );
};
export default AccessDenied;
