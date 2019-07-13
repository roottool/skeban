import React from "react";
import { createGlobalStyle } from "styled-components";
import KanbanBoard from "./components/KanbanBoard";

const App: React.FC = () => {
  return (
    <div>
      <GlobalStyles />
      <KanbanBoard />
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
`;

export default App;
