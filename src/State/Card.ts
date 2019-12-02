import { useEffect, useState, useRef } from "react";
import { createContainer } from "unstated-next";
import DB, { CardTable } from "../DB";

type Cards = CardTable[];

const useCardState = () => {
  const isInitialCardsMount = useRef(true);

  const [allCards, setAllCards] = useState<Cards>([]);

  useEffect(() => {
    if (isInitialCardsMount.current) {
      isInitialCardsMount.current = false;

      DB.cardTable.toArray().then(cardsData => {
        setAllCards(cardsData);
      });
    }
  }, [allCards]);

  const onCardTableUpdateCompleted = (
    boardId: number,
    skipUpdatedTimestamp = false
  ) => {
    DB.cardTable
      .toArray()
      .then(cards => {
        setAllCards(cards);

        if (!skipUpdatedTimestamp) {
          const updatedTimestamp = Date.now();
          DB.boardTable.update(boardId, { updatedTimestamp });
        }
      })
      .catch(err => {
        throw err;
      });
  };

  const onCardAdded = (boardId: number, listId: number) => {
    allCards
      .filter(card => card.listId === listId)
      .forEach(card => {
        if (!card.id) {
          return;
        }
        DB.cardTable.update(card.id, {
          index: card.index + 1
        });
      });
    DB.cardTable
      .add({
        listId,
        index: 0,
        text: ""
      })
      .then(() => onCardTableUpdateCompleted(boardId))
      .catch(err => {
        throw err;
      });
  };

  const onCardDeleted = (boardId: number, cardId: number) => {
    DB.cardTable
      .delete(cardId)
      .then(() => onCardTableUpdateCompleted(boardId))
      .catch(err => {
        throw err;
      });
  };

  const onCardTextChanged = (boardId: number, cardId: number, text: string) => {
    DB.cardTable
      .update(cardId, { text })
      .then(() => onCardTableUpdateCompleted(boardId))
      .catch(err => {
        throw err;
      });
  };

  return {
    allCards,
    onCardAdded,
    onCardDeleted,
    onCardTextChanged,
    onCardTableUpdateCompleted
  };
};

export default createContainer(useCardState);
