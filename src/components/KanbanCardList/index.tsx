import React from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";
import AppContainer from "../../State/AppContainer";

interface Props {
  filename: string;
  index: number;
}

const KanbanCardList: React.FC<Props> = props => {
  const { filename, index } = props;

  const container = AppContainer.useContainer();
  const { list } = container.board[index];

  const onAddBtnClicked = () => {
    container.onCardAdded(index);
  };

  return (
    <Draggable draggableId={filename} index={index}>
      {provided => (
        <StyledPaper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <KanbanCardListTitleArea filename={filename} index={index} />
          <Droppable droppableId={filename} type="Card">
            {cardProvided => (
              <div {...cardProvided.droppableProps} ref={cardProvided.innerRef}>
                {list.map((card, cardIndex) => (
                  <KanbanCard
                    key={card.filename}
                    filename={card.filename}
                    listIndex={index}
                    cardIndex={cardIndex}
                  />
                ))}
                {cardProvided.placeholder}
              </div>
            )}
          </Droppable>
          <StyledAddButtonArea>
            <Fab color="secondary" aria-label="Add" onClick={onAddBtnClicked}>
              <AddIcon />
            </Fab>
          </StyledAddButtonArea>
        </StyledPaper>
      )}
    </Draggable>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
  flex: 0 0 360px;
  margin: 16px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;
