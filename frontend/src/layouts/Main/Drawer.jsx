import { useNavigate } from "react-router-dom";

import Offcanvas from "react-bootstrap/Offcanvas";
import ListGroup from "react-bootstrap/ListGroup";

import { BiHomeAlt } from "react-icons/bi";
import { MdOutlineSpaceDashboard } from "react-icons/md";

function Drawer({ show, onHide }) {
  const navigate = useNavigate();

  const alertClicked = () => {
    alert("You clicked the third ListGroupItem");
  };

  return (
    <Offcanvas style={{ width: "200px" }} show={show} onHide={onHide}>
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>메뉴</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body style={{ paddingLeft: 0, paddingRight: 0 }}>
        <ListGroup
          style={{
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }}
        >
          <ListGroup.Item
            action
            onClick={() => {
              navigate("/home");
              onHide();
            }}
          >
            <BiHomeAlt style={{ marginBottom: "3px", marginRight: "5px" }} />홈
          </ListGroup.Item>
          <ListGroup.Item
            action
            onClick={() => {
              navigate("/dashboard");
              onHide();
            }}
          >
            <MdOutlineSpaceDashboard
              style={{ marginBottom: "3px", marginRight: "5px" }}
            />
            대시보드
          </ListGroup.Item>
        </ListGroup>
      </Offcanvas.Body>
    </Offcanvas>
  );
}

export default Drawer;
