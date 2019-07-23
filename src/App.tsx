import React, { Fragment, useState } from "react";
import { createGlobalStyle } from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Drawer from "@material-ui/core/Drawer";
import CircularProgress from "@material-ui/core/CircularProgress";
import DB from "./DB";
import LeftSideBar from "./components/LeftSideList";
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

type ElevationScrollProps = {
  children: React.ReactElement;
};

const App: React.FC = () => {
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  const toggleLeftSideBar = (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" ||
        (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setIsLeftSideBarOpen(!isLeftSideBarOpen);
  };

  const ElevationScroll = (props: ElevationScrollProps) => {
    const { children } = props;
    return React.cloneElement(children, {
      elevation: 4
    });
  };

  const renderBoard = () => {
    const boardId = 4;

    if (boardId) {
      return <Board boardId={boardId} />;
    }
    return <CircularProgress color="primary" />;
  };

  return (
    <Fragment>
      <GlobalStyles />
      <ElevationScroll {...Fragment}>
        <AppBar>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Menu"
              onClick={toggleLeftSideBar}
              onKeyDown={toggleLeftSideBar}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
      <Drawer open={isLeftSideBarOpen} onClose={toggleLeftSideBar}>
        <LeftSideBar toggleLeftSideBar={toggleLeftSideBar} />
      </Drawer>
      <Toolbar />
      {renderBoard()}
    </Fragment>
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
