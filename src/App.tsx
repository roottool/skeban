import React, { useEffect, useState, useRef } from "react";
import { createGlobalStyle } from "styled-components";
import CircularProgress from "@material-ui/core/CircularProgress";
import DB, { BoardTable } from "./DB";
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
  const isInitialMount = useRef(true);
  const isInitialBoardMount = useRef(true);
  const [boards, setBoards] = useState<BoardTable[]>([]);
  const [boardId, setBoardId] = useState<number>();

  const promiseBoardId = () => {
    return DB.boardTable.count(count => {
      if (count > 0) {
        return DB.boardTable
          .orderBy("id")
          .first(data => {
            if (data && data.id) {
              return data.id;
            }

            throw new Error("Board not found.");
          })
          .catch(err => {
            throw err;
          });
      }

      return 0;
    });
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      const resolveAsync = async () => {
        const result = await promiseBoardId();
        setBoardId(result);
      };
      resolveAsync();
    }
  }, []);

  useEffect(() => {
    if (isInitialBoardMount.current) {
      isInitialBoardMount.current = false;

      DB.boardTable.toArray().then(data => {
        setBoards(data);
      });
    }
  }, [boards]);

  const renderBoard = () => {
    if (!boardId) {
      return <CircularProgress color="primary" />;
    }
    return <Board boardId={boardId} />;
  };

  return (
    <div>
      <GlobalStyles />
      {renderBoard()}
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
