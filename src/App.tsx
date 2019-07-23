import React, { Fragment, useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Delete from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import State from "./State";
import LeftSideBar from "./components/LeftSideList";
import Board from "./components/Board";

type ElevationScrollProps = {
  children: React.ReactElement;
};

const App: React.FC = () => {
  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);

  const Container = State.useContainer();

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

  const handleDeleteButtonClicked = () => {
    if (Container.currentBoardId) {
      Container.onBoardDeleted(Container.currentBoardId);
    }
  };

  const renderBoardTitle = () => {
    const board = Container.allBoards.find(
      boardData => boardData.id === Container.currentBoardId
    );

    if (board) {
      const title = board.title ? board.title : "The title is empty";
      return <Typography variant="h6">{title}</Typography>;
    }

    return <></>;
  };

  const renderBoardDeleteButton = () => {
    const boardId = Container.currentBoardId;

    return (
      boardId && (
        <IconButton
          aria-label="Delete the board"
          onClick={handleDeleteButtonClicked}
          color="inherit"
        >
          <Delete />
        </IconButton>
      )
    );
  };

  const renderBoard = () => {
    const boardId = Container.currentBoardId;

    return boardId && <Board boardId={boardId} />;
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
            {renderBoardTitle()}
            <StyledFlexGrow />
            {renderBoardDeleteButton()}
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

const StyledFlexGrow = styled.div`
  flex-grow: 1;
`;

export default App;
