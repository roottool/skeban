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

  return {
    allCards,
    onCardAdded,
    onCardDeleted,
    onCardTextChanged,
    onCardTableUpdateCompleted
  };
};

export default createContainer(useCardState);
