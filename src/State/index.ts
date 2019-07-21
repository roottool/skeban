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

  const swapList = (
    boardId: number,
    draglistId: number,
    sourceIndex: number,
    destinationIndex: number
  ) => {
    const lowerIndex =
      destinationIndex > sourceIndex ? sourceIndex : destinationIndex;
    const upperIndex =
      destinationIndex > sourceIndex ? destinationIndex : sourceIndex;
    const range = allLists.slice(lowerIndex, upperIndex - lowerIndex + 1);
    const dragList = range.filter(list => list.id === draglistId).pop();

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
            DB.listTable
              .update(id, { index: range[indexOfRange].index })
              .catch(err => {
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

  const onDragEnded = (dropResult: DropResult) => {
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
          const boardId = parseInt(source.droppableId, 10);
          const draglistId = parseInt(draggableId, 10);
          swapList(boardId, draglistId, source.index, destination.index);
        } catch (err) {
          throw err;
        }
        break;
      }
      case "Card":
        // setAllListDetail(prev => {
        //   const sourceListIndex = prev.findIndex(
        //     target => target.filename === source.droppableId
        //   );
        //   const destinationListIndex = prev.findIndex(
        //     target => target.filename === destination.droppableId
        //   );
        //   const saveState = prev.slice(0, prev.length);
        //   const saveFileData: Cards = {
        //     filename: draggableId
        //   };
        //   saveState[sourceListIndex].cards.splice(source.index, 1);
        //   saveState[destinationListIndex].cards.splice(
        //     destination.index,
        //     0,
        //     saveFileData
        //   );
        //   localStorageActionWrapper(
        //     "SAVE",
        //     draggableId,
        //     jsonStringify(saveFileData)
        //   );
        //   return saveState;
        // });
        break;
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
