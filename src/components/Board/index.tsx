import React, { useEffect, useState, useRef } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CircularProgress from "@material-ui/core/CircularProgress";
import styled from "styled-components";
import { DragDropContext, DropResult, Droppable } from "react-beautiful-dnd";
import DB, { ListTable } from "../../DB";
import List from "../List";

interface Props {
  boardId: number;
}

const KanbanBoard: React.FC<Props> = props => {
  const isInitialMount = useRef(true);

  const { boardId } = props;

  const [lists, setLists] = useState<ListTable[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isInitialMount.current) {
      DB.listTable
        .where("boardId")
        .equals(boardId)
        .toArray()
        .then(data => {
          setLists(data);
          setIsLoading(false);
          isInitialMount.current = false;
        })
        .catch(err => {
          throw err;
        });
    } else {
      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  }, [lists]);

  const onNewListAdditionCompleted = () => {
    DB.listTable
      .where("boardId")
      .equals(boardId)
      .toArray()
      .then(data => {
        setLists(data);
      })
      .catch(err => {
        throw err;
      });
  };

  const handleAddButtonClicked = async () => {
    await DB.listTable
      .add({
        boardId,
        index: lists.length,
        title: ""
      })
      .then(() => {
        onNewListAdditionCompleted();
      })
      .catch(err => {
        throw err;
      });
  };

  const swapList = (sourceIndex: number, destinationIndex: number) => {
    setLists(prev => {
      const swappedLists = prev.slice(0, prev.length);

      swappedLists.splice(sourceIndex, 1);
      swappedLists.splice(destinationIndex, 0, prev[sourceIndex]);

      const lowerIndex =
        destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
      const upperIndex =
        destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
      for (let index = lowerIndex; index <= upperIndex; index += 1) {
        swappedLists[index].index = index;
      }

      return swappedLists;
    });
  };

  const onDragEnded = (dropResult: DropResult) => {
    const { destination, source, type } = dropResult;

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
      case "List": {
        swapList(source.index, destination.index);
        break;
      }
      case "Card":
        break;
      default:
        break;
    }
  };

  const renderLists = () => {
    const result = lists
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
            setLists={setLists}
          />
        );
      });
    return result;
  };

  return (
    <>
      {isLoading ? (
        <CircularProgress color="primary" />
      ) : (
        <StyledKanbanBoard>
          <DragDropContext onDragEnd={onDragEnded}>
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
        </StyledKanbanBoard>
      )}
    </>
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
