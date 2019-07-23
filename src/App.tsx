import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import { createGlobalStyle } from "styled-components";
import Board from "./components/Board";
import Home from "./components/Home";

const App: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/board/:boardId" component={Board} />
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  code {
    font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
      monospace;
  }

  h1, h2, h3, h4, h5, h6, p {
    margin: 4px 0px;
  }
`;

export default App;
