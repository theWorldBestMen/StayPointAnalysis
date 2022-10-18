import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import MapView from "./MapView";
import ChartView from "./ChartView";
import ResearcherView from "./ResearcherView";

function Dashboard() {
  return (
    <div
      style={{
        margin: "50px 30px",
        padding: "15px",
        border: "solid #DEE2E6",
        borderTopRightRadius: "10px",
        borderTopLeftRadius: "10px",
      }}
    >
      <Tabs defaultActiveKey="Dashboard" transition={false}>
        <Tab eventKey="Dashboard" title="Dashboard">
          <MapView />
        </Tab>
        <Tab eventKey="Chart" title="Chart">
          <ChartView />
        </Tab>
        <Tab eventKey="Researcher" title="연구자 메뉴">
          <ResearcherView />
        </Tab>
      </Tabs>
    </div>
  );
}

export default Dashboard;
