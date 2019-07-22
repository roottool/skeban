import { useEffect, useState, useRef } from "react";
import { createContainer } from "unstated-next";
import { DropResult } from "react-beautiful-dnd";
import DB, { BoardTable, ListTable, CardTable } from "../DB";

type Boards = BoardTable[];
type Lists = ListTable[];
type Cards = CardTable[];

const useStore = () => {
  const isInitialBoardsMount = useRef(true);
  const isInitialListsMount = useRef(true);
  const isInitialCardsMount = useRef(true);
  const isInitialCurrentBoardIdMount = useRef(true);

  const [allBoards, setAllBoards] = useState<Boards>([]);
  const [allLists, setAllLists] = useState<Lists>([]);
  const [allCards, setAllCards] = useState<Cards>([]);
  const [currentBoardId, setCurrentBoardId] = useState<number>();

  useEffect(() => {
    if (isInitialBoardsMount.current) {
      isInitialBoardsMount.current = false;

      DB.boardTable.toArray().then(boardsData => {
        setAllBoards(boardsData);
      });
    }
  }, [allBoards]);

  useEffect(() => {
    if (isInitialListsMount.current) {
      isInitialListsMount.current = false;

      DB.listTable.toArray().then(listsData => {
        setAllLists(listsData);
      });
    }
  }, [allLists]);

  useEffect(() => {
    if (isInitialCardsMount.current) {
      isInitialCardsMount.current = false;

      DB.cardTable.toArray().then(cardsData => {
        setAllCards(cardsData);
      });
    }
  }, [allCards]);

  useEffect(() => {
    if (isInitialCurrentBoardIdMount) {
      isInitialCurrentBoardIdMount.current = false;
      if (allBoards[0] && allBoards[0].id) {
        setCurrentBoardId(allBoards[0].id);
      }
    }
  }, [currentBoardId]);

  const onBoardAdded = () => {
    const createdTimestamp = Date.now();
    DB.boardTable
      .add({
        createdTimestamp,
        title: "",
        updatedTimestamp: createdTimestamp
      })
      .then(() => {
        setAllBoards(prev => {
          const saveData: Boards = [
            ...prev,
            {
              createdTimestamp,
              title: "",
              updatedTimestamp: createdTimestamp
            }
          ];
          return saveData;
        });
      })
      .catch(err => {
        throw err;
      });
  };

  const onListTableUpdateCompleted = () => {
    DB.listTable
      .toArray()
      .then(lists => {
        setAllLists(lists);
      })
      .catch(err => {
        throw err;
      });
  };

  const onListAdded = (boardId: number) => {
    const index = allLists.filter(list => list.boardId === boardId).length;
    DB.listTable
      .add({
        boardId,
        index,
        title: ""
      })
      .then(() => onListTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onListDeleted = (boardId: number, listId: number) => {
    DB.listTable
      .delete(listId)
      .then(() => onListTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onListTitleChanged = (
    boardId: number,
    listId: number,
    title: string
  ) => {
    DB.listTable
      .update(listId, { title })
      .then(() => onListTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onCardTableUpdateCompleted = () => {
    DB.cardTable
      .toArray()
      .then(cards => {
        setAllCards(cards);
      })
      .catch(err => {
        throw err;
      });
  };

  const onCardAdded = (boardId: number, listId: number) => {
    const index = allCards.filter(card => card.listId === listId).length;
    DB.cardTable
      .add({
        listId,
        index,
        text: ""
      })
      .then(() => onCardTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onCardDeleted = (boardId: number, cardId: number) => {
    DB.cardTable
      .delete(cardId)
      .then(() => onCardTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onCardTextChanged = (boardId: number, cardId: number, text: string) => {
    DB.cardTable
      .update(cardId, { text })
      .then(() => onCardTableUpdateCompleted())
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
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
        const { id } = destinationRange[indexOfRange];
        if (id && index === destinationIndex) {
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
          const dragListId = parseInt(draggableId, 10);
          swapLists(boardId, dragListId, source.index, destination.index);
        } catch (err) {
          throw err;
        }
        break;
      }
      case "Card": {
        try {
          const dragCardtId = parseInt(draggableId, 10);
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
    onBoardAdded,
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
