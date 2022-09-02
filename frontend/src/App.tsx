import React from "react";
import styled from "styled-components";
import { BrowserRouter } from "react-router-dom";

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
    <BrowserRouter>
      <Provider store={store}>
        <AppContainer>
          <AppInner />
        </AppContainer>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
