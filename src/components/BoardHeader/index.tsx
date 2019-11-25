import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Delete from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import State from "../../State";
import LeftSideBar from "../LeftSideList";

type ElevationScrollProps = {
  children: React.ReactElement;
};

type Props = {
  boardId: number;
};

const BoardHeader: React.FC<Props> = props => {
  const { boardId } = props;

  const [isLeftSideBarOpen, setIsLeftSideBarOpen] = useState(false);
  const [isInputArea, setIsInputArea] = useState(false);

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

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleBoardTitleChanged = (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    Container.onBoardTitleChanged(boardId, event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  const handleDeleteButtonClicked = () => {
    Container.onBoardDeleted(boardId);
  };

  const renderBoardTitle = () => {
    const board = Container.allBoards.find(
      boardData => boardData.id === boardId
    );

    if (board) {
      return (
        <>
          {isInputArea ? (
            <StyledBoardTitleForm>
              <StyledBoardTitleTextField
                id="board-name"
                label="Board Title"
                value={board.title ? board.title : ""}
                margin="normal"
                autoFocus
                fullWidth
                onChange={handleBoardTitleChanged}
                onKeyPress={handleKeyPressed}
                onBlur={handleisInputAreaChange}
              />
            </StyledBoardTitleForm>
          ) : (
            <StyledBoardTitleDiv onClick={handleisInputAreaChange}>
              <Typography variant="h6" gutterBottom>
                {board.title ? board.title : "The title is empty"}
              </Typography>
            </StyledBoardTitleDiv>
          )}
        </>
      );
    }

    return <></>;
  };

  return (
    <div>
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
          <StyledLink to="/">
            <IconButton
              aria-label="Delete the board"
              onClick={handleDeleteButtonClicked}
              color="inherit"
            >
              <Delete />
            </IconButton>
          </StyledLink>
        </Toolbar>
      </AppBar>
      <Drawer open={isLeftSideBarOpen} onClose={toggleLeftSideBar}>
        <LeftSideBar toggleLeftSideBar={toggleLeftSideBar} />
      </Drawer>
      <Toolbar />
    </div>
  );
};

const StyledBoardTitleForm = styled.form`
  flex-grow: 1;
`;

const StyledBoardTitleTextField = styled(TextField)`
  background-color: white;
`;

const StyledBoardTitleDiv = styled.div`
  flex-grow: 1;
  word-break: break-word;
  cursor: pointer;
`;

const StyledLink = styled(Link)`
  color: inherit;
`;

export default BoardHeader;
