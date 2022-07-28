import React from "react";
import "./App.css";
import styled from "styled-components";

import { Provider } from "react-redux";
import store from "./store";
import AppInner from "./AppInner";

const AppContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function App() {
  return (
    <Provider store={store}>
      <AppContainer>
        <AppInner />
      </AppContainer>
    </Provider>
  );
}

export default App;
