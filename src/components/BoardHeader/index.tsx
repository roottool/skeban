import React, { Fragment, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Delete from "@material-ui/icons/Delete";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import State from "../../State";

type ElevationScrollProps = {
  children: React.ReactElement;
};

type Props = {
  boardId: number;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: "#009CFF",
      color: "white",
      zIndex: theme.zIndex.drawer + 1
    }
  })
);

const BoardHeader: React.FC<Props> = props => {
  const { boardId } = props;
  const classes = useStyles();

  const [isInputArea, setIsInputArea] = useState(false);

  const Container = State.useContainer();

  const ElevationScroll = (elevationScrollProps: ElevationScrollProps) => {
    const { children } = elevationScrollProps;
    return React.cloneElement(children, {
      elevation: 4
    });
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
    <>
      <ElevationScroll {...Fragment}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            {renderBoardTitle()}
            <StyledLink to="/">
              <IconButton
                aria-label="Delete the board"
                onClick={handleDeleteButtonClicked}
                color="secondary"
              >
                <Delete />
              </IconButton>
            </StyledLink>
          </Toolbar>
        </AppBar>
      </ElevationScroll>
    </>
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
