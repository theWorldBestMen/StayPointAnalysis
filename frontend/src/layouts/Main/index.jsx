import Header from "./Header";
import styled from "styled-components";
import { Outlet } from "react-router-dom";

const Container = styled.div`
  // display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

function MainLayout() {
  return (
    <Container>
      <Header />
      <Outlet />
    </Container>
  );
}

export default MainLayout;
