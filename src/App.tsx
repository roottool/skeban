import React from "react";
import { createGlobalStyle } from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import DB from "./DB";
import Board from "./components/Board";

const initialDB = async () => {
  await DB.boardTable.count(count => {
    if (count === 0) {
      const createdTimestamp = Date.now();
      DB.boardTable.put({
        title: "",
        createdTimestamp,
        updatedTimestamp: createdTimestamp
      });
    }
  });
};
initialDB();

const App: React.FC = () => {
  const renderBoard = () => {
    const boardId = 4;
    if (boardId) {
      return <Board boardId={boardId} />;
    }
    return <CircularProgress color="primary" />;
  };

  return (
    <>
      <GlobalStyles />
      {renderBoard()}
    </>
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
