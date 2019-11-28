import React from "react";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { match as Match } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import { createStyles, Theme, makeStyles } from "@material-ui/core/styles";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";
import BoardHeader from "../BoardHeader";
import List from "../List";
import LeftSideList from "../LeftSideList";

type Identifiable = {
  boardId: string;
};

type Props = {
  match: Match<Identifiable>;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    main: {
      display: "flex",
      flexGrow: 1,
      margin: "8px 0px",
      padding: theme.spacing(3)
    },
    toolbar: theme.mixins.toolbar
  })
);

const Board: React.FC<Props> = props => {
  const { match } = props;
  const { boardId } = match.params;
  const classes = useStyles();

  const boardIdNumber = () => {
    return parseInt(boardId, 10);
  };

  const Container = State.useContainer();

  const handleAddButtonClicked = () => {
    Container.onListAdded(boardIdNumber());
  };

  const handleDragEnded = (result: DropResult) => {
    Container.onDragEnded(boardIdNumber(), result);
  };

  const renderLists = () => {
    const id = boardIdNumber();
    const result = Container.allLists
      .filter(list => list.boardId === id)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
        if (!list.id) {
          return <></>;
        }
        return (
          <List
            key={list.id}
            boardId={id}
            listId={list.id}
            listIndex={listIndex}
          />
        );
      });
    return result;
  };

  return (
    <StyledRoot>
      <BoardHeader boardId={boardIdNumber()} />
      <LeftSideList />
      <main className={classes.main}>
        <div className={classes.toolbar} />
        <DragDropContext onDragEnd={handleDragEnded}>
          <Droppable
            droppableId={`${boardId}`}
            direction="horizontal"
            type="List"
          >
            {provided => (
              <StyledContainer
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {renderLists()}
                {provided.placeholder}
              </StyledContainer>
            )}
          </Droppable>
        </DragDropContext>
        <StyledAddbuttonArea>
          <Fab
            color="primary"
            aria-label="Add"
            onClick={handleAddButtonClicked}
          >
            <AddIcon />
          </Fab>
        </StyledAddbuttonArea>
      </main>
    </StyledRoot>
  );
};

const StyledRoot = styled.div`
  display: flex;
`;

const StyledContainer = styled.div`
  display: flex;
`;

const StyledAddbuttonArea = styled.div`
  flex: 0 0 360px;
  margin-top: 48px;
`;

export default Board;
