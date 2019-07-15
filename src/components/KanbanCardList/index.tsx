import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import uuidv1 from "uuid/v1";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import { Draggable, Droppable } from "react-beautiful-dnd";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";
import { CardListData, CardListState, MovedCardData } from "./interface";

interface Props {
  filename: string;
  index: number;
  movedCardData?: MovedCardData;
  handleKanbanCardListDelete: (filename: string) => void;
}

const KanbanCardList: React.FC<Props> = props => {
  const isInitialMount = useRef(true);
  const { filename, index, movedCardData, handleKanbanCardListDelete } = props;
  const initialJsonData = localStorage.getItem(filename) || "{}";
  const initialCardList: CardListData = JSON.parse(initialJsonData);

  const [title, setTitle] = useState(initialCardList.title || "");
  const [cardList, setCardList] = useState<CardListState[]>(
    initialCardList.data || []
  );

  useEffect(() => {
    const jsonData: CardListData = {
      title,
      data: cardList
    };
    const saveData = JSON.stringify(jsonData);
    localStorage.setItem(filename, saveData);
  }, [cardList]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const initialData = initialCardList.data || [];
      if (movedCardData === undefined && !movedCardData) {
        return;
      }

      const { draggableId, draggableIndex } = movedCardData;

      if (initialData === []) {
        initialData.push({ filename: draggableId });
        setCardList(initialData);
      }

      const dropResult = initialData.filter(
        target => target.filename !== draggableId
      );
      dropResult.splice(draggableIndex, 0, {
        filename: draggableId
      });
      setCardList(dropResult);
    }
  }, [movedCardData]);

  const deleteKanbanCard = (targetFilename: string) => {
    setCardList(prev => {
      return prev.filter(target => target.filename !== targetFilename);
    });
  };

  const handleAddButtonClicked = () => {
    setCardList(prev => [...prev, { filename: uuidv1() }]);
  };

  return (
    <Draggable draggableId={filename} index={index}>
      {provided => (
        <StyledPaper
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          innerRef={provided.innerRef}
        >
          <KanbanCardListTitleArea
            filename={filename}
            value={title}
            setTitle={setTitle}
            handleKanbanCardListDelete={handleKanbanCardListDelete}
          />
          <Droppable droppableId={filename} type="kanbanCard">
            {cardProvided => (
              <div {...cardProvided.droppableProps} ref={cardProvided.innerRef}>
                {cardList.map((card, cardIndex) => (
                  <KanbanCard
                    key={card.filename}
                    filename={card.filename}
                    index={cardIndex}
                    handleKanbanCardDelete={deleteKanbanCard}
                  />
                ))}
                {cardProvided.placeholder}
              </div>
            )}
          </Droppable>
          <StyledAddButtonArea>
            <Fab
              color="secondary"
              aria-label="Add"
              onClick={handleAddButtonClicked}
            >
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
