import React from "react";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import State from "../../State";
import List from "../List";

interface Props {
  boardId: number;
}

const Board: React.FC<Props> = props => {
  const { boardId } = props;

  const Container = State.useContainer();

  const handleAddButtonClicked = () => {
    Container.onListAdded(boardId);
  };

  const handleDragEnded = (result: DropResult) => {
    Container.onDragEnded(boardId, result);
  };

  const renderLists = () => {
    const result = Container.allLists
      .filter(list => list.boardId === boardId)
      .sort((a, b) => a.index - b.index)
      .map((list, listIndex) => {
        if (!list.id) {
          return <></>;
        }
        return (
          <List
            key={list.id}
            boardId={boardId}
            listId={list.id}
            listIndex={listIndex}
          />
        );
      });
    return result;
  };

  return (
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
        <Fab color="primary" aria-label="Add" onClick={handleAddButtonClicked}>
          <AddIcon />
        </Fab>
      </StyledAddbuttonArea>
    </StyledBoard>
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
