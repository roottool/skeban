import React from "react";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import { match as Match } from "react-router-dom";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";
import BoardHeader from "../BoardHeader";
import List from "../List";

type Identifiable = {
  boardId: string;
};

type Props = {
  match: Match<Identifiable>;
};

const Board: React.FC<Props> = props => {
  const { match } = props;
  const { boardId } = match.params;

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
    <div>
      <BoardHeader boardId={boardIdNumber()} />
      <StyledBoard>
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
      </StyledBoard>
    </div>
  );
};

const StyledBoard = styled.div`
  display: flex;
  margin: 8px 0px;
`;

const StyledContainer = styled.div`
  display: flex;
`;

const StyledAddbuttonArea = styled.div`
  flex: 0 0 360px;
  text-align: center;
  margin-top: 16px;
`;

export default Board;
