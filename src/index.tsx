import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import AppState from "./State";
import ListState from "./State/List";
import CardState from "./State/Card";
// eslint-disable-next-line import/extensions
import "typeface-roboto";

ReactDOM.render(
  <ListState.Provider>
    <CardState.Provider>
      <AppState.Provider>
        <App />
      </AppState.Provider>
    </CardState.Provider>
  </ListState.Provider>,
  document.getElementById("root")
);
