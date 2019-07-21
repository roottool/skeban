import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import State from "./State";
// eslint-disable-next-line import/extensions
import "typeface-roboto";

ReactDOM.render(
  <State.Provider>
    <App />
  </State.Provider>,
  document.getElementById("root")
);
