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
        .sortBy("index")
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
      .sortBy("index")
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

  const onSortListCompleted = () => {
    DB.listTable
      .where("boardId")
      .equals(boardId)
      .sortBy("index")
      .then(data => {
        setLists(data);
      })
      .catch(err => {
        throw err;
      });
  };

  const swapList = (
    listArray: ListTable[],
    sourceIndex: number,
    destinationIndex: number
  ) => {
    let index = 0;
    const allPromise: Promise<number>[] = [];

    listArray.forEach(list => {
      if (list.id && list.index === sourceIndex) {
        allPromise.push(
          DB.listTable
            .update(list.id, { index: destinationIndex })
            .catch(err => {
              throw err;
            })
        );
      } else if (list.id && list.index === destinationIndex) {
        allPromise.push(
          DB.listTable.update(list.id, { index: sourceIndex }).catch(err => {
            throw err;
          })
        );
      }
    });

    const updateListTable = () => {
      if (index < allPromise.length) {
        allPromise[index].then(() => {
          index += 1;
          updateListTable();
        });
      }
    };
    updateListTable();
    onSortListCompleted();
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
        const lowerIndex =
          destination.index > source.index ? source.index : destination.index;
        const upperIndex =
          destination.index > source.index ? destination.index : source.index;

        DB.listTable
          .where("index")
          .between(lowerIndex, upperIndex, true, true)
          .toArray()
          .then(listArray =>
            swapList(listArray, source.index, destination.index)
          )
          .catch(err => {
            throw err;
          });
        break;
      }
      case "Card":
        break;
      default:
        break;
    }
  };

  const renderLists = () => {
    const result = lists.map((list, listIndex) => {
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
