import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Draggable, Droppable } from "react-beautiful-dnd";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import DB, { CardTable } from "../../DB";
import State from "../../State";
import ListTitleArea from "../ListTitleArea";
import Card from "../Card";

interface Props {
  boardId: number;
  listId: number;
  listIndex: number;
}

const List: React.FC<Props> = props => {
  const isInitialMount = useRef(true);

  const { boardId, listId, listIndex } = props;

  const Container = State.useContainer();
  const [cards, setCards] = useState<CardTable[]>([]);
  const [isDragDisabled, setIsDragDisabled] = useState(false);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;

      DB.cardTable
        .where("listId")
        .equals(listId)
        .sortBy("index")
        .then(data => setCards(data))
        .catch(err => {
          throw err;
        });
    } else {
      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  }, [cards]);

  const onAddButtonClicked = () => {
    Container.onCardAdded(boardId, listId);
  };

  const onDeleteButtonClicked = () => {
    Container.onListDeleted(boardId, listId);
  };

  const renderCards = () => {
    const result = Container.allCards
      .filter(card => card.listId === listId)
      .sort((a, b) => a.index - b.index)
      .map((card, cardIndex) => {
        if (!card.id) {
          return <></>;
        }

        return (
          <Card
            key={card.id}
            boardId={boardId}
            cardId={card.id}
            cardIndex={cardIndex}
            onClicked={setIsDragDisabled}
          />
        );
      });

    return result;
  };

  return (
    <Draggable
      draggableId={`listId-${listId}`}
      index={listIndex}
      isDragDisabled={isDragDisabled}
    >
      {provided => (
        <StyledPaper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <StyledButtonArea>
            <Fab
              variant="extended"
              size="medium"
              color="primary"
              aria-label="Add new card"
              onClick={onAddButtonClicked}
            >
              <AddIcon />
              ADD NEW CARD
            </Fab>
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this list"
              onClick={onDeleteButtonClicked}
            >
              <DeleteIcon />
              DELETE THIS LIST
            </Fab>
          </StyledButtonArea>
          <ListTitleArea boardId={boardId} listId={listId} />
          <Droppable droppableId={`listId-${listId}`} type="Card">
            {cardProvided => (
              <StyledContainer
                {...cardProvided.droppableProps}
                ref={cardProvided.innerRef}
              >
                {renderCards()}
                {cardProvided.placeholder}
              </StyledContainer>
            )}
          </Droppable>
        </StyledPaper>
      )}
    </Draggable>
  );
};

const StyledPaper = styled(Paper)`
  width: 400px;
  height: fit-content;
  flex: 0 0 400px;
  margin: 16px;
`;

const StyledContainer = styled.div`
  padding-bottom: 40px;
`;

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 16px;
`;

export default List;
