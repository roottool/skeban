import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AppContainer from "../../State/AppContainer";
import KanbanCardList from "../KanbanCardList";

const KanbanBoard: React.FC = () => {
  const container = AppContainer.useContainer();

  return (
    <StyledKanbanBoard>
      <DragDropContext onDragEnd={container.onDragEnded}>
        <Droppable
          droppableId="all-kanbanCardList"
          direction="horizontal"
          type="List"
        >
          {provided => (
            <StyledContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {container.board.map((list, index) => (
                <KanbanCardList
                  key={list.filename}
                  filename={list.filename}
                  index={index}
                />
              ))}
              {provided.placeholder}
            </StyledContainer>
          )}
        </Droppable>
      </DragDropContext>
      <StyledAddbuttonArea>
        <Fab color="primary" aria-label="Add" onClick={container.onListAdded}>
          <AddIcon />
        </Fab>
      </StyledAddbuttonArea>
    </StyledKanbanBoard>
  );
};

const StyledKanbanBoard = styled.div`
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

export default KanbanBoard;
