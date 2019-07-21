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
  const [allCards] = useState<Cards>([]);
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

      // DB.cardTable.toArray().then(cardsData => {
      //   setAllCards(cardsData);
      // });
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

  const onListTableUpdateCompleted = (boardId: number) => {
    DB.listTable
      .where("boardId")
      .equals(boardId)
      .sortBy("index")
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
      .then(() => onListTableUpdateCompleted(boardId))
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onListDeleted = (boardId: number, listId: number) => {
    DB.listTable
      .delete(listId)
      .then(() => onListTableUpdateCompleted(boardId))
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
      .then(() => {
        DB.listTable
          .toArray()
          .then(() => onListTableUpdateCompleted(boardId))
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });

    const updatedTimestamp = Date.now();
    DB.boardTable.update(boardId, { updatedTimestamp });
  };

  const onCardAdded = (boardId: number, listId: number) => {
    console.log(boardId, listId);

    // const newFilename = uuidv1();
    // setAllListDetail(prev => {
    //   const { cards, filename, title } = prev[targetIndex];
    //   const saveData = prev.slice(0, prev.length);
    //   saveData.splice(targetIndex, 1, {
    //     cards: [...cards, { filename: newFilename }],
    //     filename,
    //     title
    //   });
    //   localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
    //   return saveData;
    // });
    // setAllCard(prev => {
    //   const saveData: AllCardState = [...prev, { filename: newFilename }];
    //   return saveData;
    // });
    // setAllCardDetail(prev => {
    //   const saveData: AllCardDetailState = [
    //     ...prev,
    //     { filename: newFilename, text: "" }
    //   ];
    //   localStorageActionWrapper("SAVE", newFilename, jsonStringify(saveData));
    //   return saveData;
    // });
  };

  const onCardDeleted = (boardId: number, listId: number, cardId: number) => {
    console.log(boardId, listId, cardId);

    // setAllListDetail(prev => {
    //   const { cards, filename } = prev[targetIndex];
    //   const saveData = prev.slice(0, prev.length);
    //   saveData[targetIndex].cards = cards.filter(
    //     target => target.filename !== targetFilename
    //   );
    //   localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
    //   return saveData;
    // });
    // setAllCard(prev => {
    //   const saveData = prev.filter(
    //     target => target.filename !== targetFilename
    //   );
    //   return saveData;
    // });
    // setAllCardDetail(prev => {
    //   const saveData = prev.filter(
    //     target => target.filename !== targetFilename
    //   );
    //   localStorageActionWrapper("REMOVE", targetFilename);
    //   return saveData;
    // });
  };

  const onCardTextChanged = (
    boardId: number,
    listId: number,
    cardId: number,
    value: string
  ) => {
    console.log(boardId, listId, cardId, value);

    // setAllCardDetail(prev => {
    //   const saveState = prev.slice(0, prev.length);
    //   const saveFileData: CardDetail = { filename, text: value };
    //   saveState.splice(index, 1, saveFileData);
    //   localStorageActionWrapper("SAVE", filename, jsonStringify(saveFileData));
    //   return saveState;
    // });
  };

  const onDragEnded = (dropResult: DropResult) => {
    const { destination, /* draggableId, */ source, type } = dropResult;

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
      case "List":
        // setAllBoardDetail(prev => {
        //   const targetBoardIndex = prev.findIndex(
        //     target => target.filename === destination.droppableId
        //   );
        //   const saveState = prev.slice(0, prev.length);
        //   const { lists } = saveState[targetBoardIndex];
        //   lists.splice(source.index, 1);
        //   lists.splice(destination.index, 0, {
        //     filename: draggableId
        //   });
        //   const updatedTimestamp = Date.now();
        //   saveState[targetBoardIndex].updatedBoard = updatedTimestamp;
        //   localStorageActionWrapper(
        //     "SAVE",
        //     saveState[targetBoardIndex].filename,
        //     jsonStringify(saveState)
        //   );
        //   return saveState;
        // });
        break;
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
