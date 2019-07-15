import React, { useEffect, useRef, useState } from "react";
import uuidv1 from "uuid/v1";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import { DragDropContext, Droppable, DropResult } from "react-beautiful-dnd";
import KanbanCardList from "../KanbanCardList";
import { MovedCardData } from "../KanbanCardList/interface";

interface KanbanCardListState {
  filename: string;
}

interface KanbanCardListData {
  data: KanbanCardListState[];
}

const KanbanBoard: React.FC = () => {
  const isInitialMount = useRef(true);
  const initialJsonData = localStorage.getItem("BoardData") || "{}";
  const initialBoard: KanbanCardListData = JSON.parse(initialJsonData);

  const [kanbanCardList, setKanbanCardList] = useState<KanbanCardListState[]>(
    initialBoard.data || []
  );
  const [movedCard, setMovedCard] = useState<MovedCardData | undefined>();

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const jsonData: KanbanCardListData = {
        data: kanbanCardList
      };
      const saveData = JSON.stringify(jsonData);
      localStorage.setItem("BoardData", saveData);
    }
  }, [kanbanCardList]);

  const deleteKanbanCardList = (filename: string) => {
    setKanbanCardList(prev => {
      return prev.filter(target => target.filename !== filename);
    });
  };

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId, source, type } = result;

    if (destination === undefined || !destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    switch (type) {
      case "kanbanCardList":
        setKanbanCardList(prev => {
          const dropResult = prev.filter(
            target => target.filename !== draggableId
          );
          dropResult.splice(destination.index, 0, { filename: draggableId });
          return dropResult;
        });
        break;
      case "kanbanCard":
        setMovedCard({
          draggableId,
          draggableIndex: destination.index,
          droppableId: destination.droppableId
        });
        break;
      default:
        break;
    }
  };

  const handleAddButtonClicked = async () => {
    setKanbanCardList(prev => [...prev, { filename: uuidv1() }]);
  };

  const renderCardList = (cardList: KanbanCardListState, index: number) => {
    if (movedCard && cardList.filename === movedCard.droppableId) {
      return (
        <KanbanCardList
          key={cardList.filename}
          filename={cardList.filename}
          index={index}
          movedCardData={movedCard}
          handleKanbanCardListDelete={deleteKanbanCardList}
        />
      );
    }
    return (
      <KanbanCardList
        key={cardList.filename}
        filename={cardList.filename}
        index={index}
        handleKanbanCardListDelete={deleteKanbanCardList}
      />
    );
  };

  return (
    <StyledKanbanBoard>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable
          droppableId="all-kanbanCardList"
          direction="horizontal"
          type="kanbanCardList"
        >
          {provided => (
            <StyledContainer
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {kanbanCardList.map((cardList, index) =>
                renderCardList(cardList, index)
              )}
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
