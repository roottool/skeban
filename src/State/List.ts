import { useEffect, useState, useRef } from "react";
import { createContainer } from "unstated-next";
import DB, { ListTable } from "../DB";
import useCardState from "./Card";

type Lists = ListTable[];

const useListState = () => {
  const isInitialListsMount = useRef(true);

  const [allLists, setAllLists] = useState<Lists>([]);
  const cardContainer = useCardState.useContainer();
  const { allCards, onCardTableUpdateCompleted } = cardContainer;

  useEffect(() => {
    if (isInitialListsMount.current) {
      isInitialListsMount.current = false;

      DB.listTable.toArray().then(listsData => {
        setAllLists(listsData);
      });
    }
  }, [allLists]);

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

    const cardPromiseArray: Promise<void>[] = [];
    allCards
      .filter(card => card.listId === listId)
      .forEach(card => {
        if (card.id) {
          cardPromiseArray.push(
            DB.cardTable.delete(card.id).catch(err => {
              throw err;
            })
          );
        }
      });
    Promise.all(cardPromiseArray).then(() => onCardTableUpdateCompleted());

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

  return {
    allLists,
    onListAdded,
    onListDeleted,
    onListTitleChanged,
    onListTableUpdateCompleted
  };
};

export default createContainer(useListState);
