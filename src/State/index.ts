import { useEffect, useState, useRef } from "react";
import { createContainer } from "unstated-next";
import { DropResult } from "react-beautiful-dnd";
import DB, { BoardTable } from "../DB";
import useListState from "./List";
import useCardState from "./Card";

type Boards = BoardTable[];

const useStore = () => {
  const isInitialBoardsMount = useRef(true);
  const isInitialCurrentBoardIdMount = useRef(true);

  const [allBoards, setAllBoards] = useState<Boards>([]);
  const [currentBoardId, setCurrentBoardId] = useState<number>();

  const listContainer = useListState.useContainer();
  const {
    allLists,
    onListAdded,
    onListDeleted,
    onListTitleChanged,
    onListTableUpdateCompleted
  } = listContainer;
  const cardContainer = useCardState.useContainer();
  const {
    allCards,
    onCardAdded,
    onCardDeleted,
    onCardTextChanged,
    onCardTableUpdateCompleted
  } = cardContainer;

  useEffect(() => {
    if (isInitialBoardsMount.current) {
      isInitialBoardsMount.current = false;

      DB.boardTable
        .orderBy("updatedTimestamp")
        .reverse()
        .toArray()
        .then(boardsData => {
          setAllBoards(boardsData);
        });
    }
  }, [allBoards]);

  useEffect(() => {
    if (isInitialCurrentBoardIdMount) {
      isInitialCurrentBoardIdMount.current = false;

      DB.boardTable
        .orderBy("updatedTimestamp")
        .reverse()
        .toArray()
        .then(boardsData => {
          const board = boardsData.pop();
          if (board && board.id) {
            setCurrentBoardId(board.id);
          }
        });
    }
  }, [currentBoardId]);

  const onBoardTableUpdateCompleted = () => {
    DB.boardTable
      .toArray()
      .then(boards => {
        setAllBoards(boards);
      })
      .catch(err => {
        throw err;
      });
  };

  const onBoardAdded = () => {
    const createdTimestamp = Date.now();
    DB.boardTable
      .add({
        createdTimestamp,
        title: "",
        updatedTimestamp: createdTimestamp
      })
      .then(id => {
        onBoardTableUpdateCompleted();
        setCurrentBoardId(id);
      })
      .catch(err => {
        throw err;
      });
  };

  const onBoardDeleted = (boardId: number) => {
    // TODO : Deletes all lists and cards contained in the board.
    DB.boardTable
      .delete(boardId)
      .then(() => onBoardTableUpdateCompleted())
      .catch(err => {
        throw err;
      });
  };

  const swapLists = (
    boardId: number,
    draglistId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const lowerIndex =
      destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
    const upperIndex =
      destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
    const range = allLists
      .filter(list => list.boardId === boardId)
      .sort((a, b) => a.index - b.index)
      .slice(lowerIndex, upperIndex + 1);
    const dragList = range.find(list => list.id === draglistId);

    if (dragList) {
      if (dragList.index === lowerIndex) {
        range.splice(0, 1);
        range.splice(range.length, 0, dragList);
      } else {
        range.splice(range.length - 1, 1);
        range.splice(0, 0, dragList);
      }

      let indexOfRange = 0;
      const promiseArray: Promise<number>[] = [];
      for (let index = lowerIndex; index <= upperIndex; index += 1) {
        range[indexOfRange].index = index;
        const { id } = range[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.listTable.update(id, { index }).catch(err => {
              throw err;
            })
          );
        }
        indexOfRange += 1;
      }

      Promise.all(promiseArray).then(() => onListTableUpdateCompleted());

      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  };

  const swapCardsInTheSameList = (
    boardId: number,
    dragCardtId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    const lowerIndex =
      destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
    const upperIndex =
      destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
    const range = allCards
      .filter(card => card.listId === destinationId)
      .sort((a, b) => a.index - b.index)
      .slice(lowerIndex, upperIndex + 1);
    const dragCard = range.find(card => card.id === dragCardtId);

    if (dragCard) {
      if (dragCard.index === lowerIndex) {
        range.splice(0, 1);
        range.splice(range.length, 0, dragCard);
      } else {
        range.splice(range.length - 1, 1);
        range.splice(0, 0, dragCard);
      }

      let indexOfRange = 0;
      const promiseArray: Promise<number>[] = [];
      for (let index = lowerIndex; index <= upperIndex; index += 1) {
        range[indexOfRange].index = index;
        const { id } = range[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch(err => {
              throw err;
            })
          );
        }
        indexOfRange += 1;
      }

      Promise.all(promiseArray).then(() => onCardTableUpdateCompleted());

      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  };

  const swapCardsInDifferentList = (
    boardId: number,
    dragCardtId: number,
    sourceId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    const sourceRange = allCards
      .filter(card => card.listId === sourceId)
      .slice(sourceIndex);
    const destinationRange = allCards
      .filter(card => card.listId === destinationId)
      .slice(destinationIndex);
    const dragCard = allCards.find(card => card.id === dragCardtId);

    if (dragCard) {
      sourceRange.splice(0, 1);
      destinationRange.splice(0, 0, dragCard);

      let index = sourceIndex;
      const promiseArray: Promise<number>[] = [];
      for (
        let indexOfRange = 0;
        indexOfRange < sourceRange.length;
        indexOfRange += 1
      ) {
        sourceRange[indexOfRange].index = index;
        const { id } = sourceRange[indexOfRange];
        if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch(err => {
              throw err;
            })
          );
        }

        index += 1;
      }

      index = destinationIndex;
      for (
        let indexOfRange = 0;
        indexOfRange < destinationRange.length;
        indexOfRange += 1
      ) {
        destinationRange[indexOfRange].index = index;
        const { id } = destinationRange[indexOfRange];
        if (id && index === destinationIndex) {
          destinationRange[indexOfRange].listId = destinationId;
          promiseArray.push(
            DB.cardTable
              .update(id, { listId: destinationId, index })
              .catch(err => {
                throw err;
              })
          );
        } else if (id) {
          promiseArray.push(
            DB.cardTable.update(id, { index }).catch(err => {
              throw err;
            })
          );
        }

        index += 1;
      }

      Promise.all(promiseArray).then(() => onCardTableUpdateCompleted());

      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  };

  const swapCards = (
    boardId: number,
    dragCardtId: number,
    sourceId: number,
    sourceIndex: number,
    destinationId: number,
    destinationIndex: number
  ) => {
    if (sourceId === destinationId) {
      swapCardsInTheSameList(
        boardId,
        dragCardtId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    } else {
      swapCardsInDifferentList(
        boardId,
        dragCardtId,
        sourceId,
        sourceIndex,
        destinationId,
        destinationIndex
      );
    }
  };

  const onDragEnded = (boardId: number, dropResult: DropResult) => {
    const { destination, draggableId, source, type } = dropResult;

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
        try {
          const dragListId = parseInt(draggableId.replace("listId-", ""), 10);
          swapLists(boardId, dragListId, source.index, destination.index);
        } catch (err) {
          throw err;
        }
        break;
      }
      case "Card": {
        try {
          const dragCardtId = parseInt(draggableId.replace("cardId-", ""), 10);
          const sourceId = parseInt(source.droppableId, 10);
          const destinationId = parseInt(destination.droppableId, 10);
          swapCards(
            boardId,
            dragCardtId,
            sourceId,
            source.index,
            destinationId,
            destination.index
          );
        } catch (err) {
          throw err;
        }
        break;
      }
      default:
        break;
    }
  };

  return {
    allBoards,
    allLists,
    allCards,
    currentBoardId,
    setCurrentBoardId,
    onBoardAdded,
    onBoardDeleted,
    onListAdded,
    onListDeleted,
    onListTitleChanged,
    onCardAdded,
    onCardDeleted,
    onCardTextChanged,
    onDragEnded
  };
};

export default createContainer(useStore);
