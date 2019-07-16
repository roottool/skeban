import { useEffect, useState, useRef } from "react";
import { createContainer } from "unstated-next";
import uuidv1 from "uuid/v1";
import { DropResult } from "react-beautiful-dnd";

interface AppData {
  data: BoardState;
}

interface List {
  list: Card[];
  filename: string;
  title: string;
}

interface Card {
  filename: string;
  text: string;
}

type BoardState = List[];

const useStore = () => {
  const isInitialMount = useRef(true);
  const initialBoardStateJson = localStorage.getItem("BoardData") || "[]";
  const initialBoardState: AppData = JSON.parse(initialBoardStateJson);

  const [board, setBoard] = useState<BoardState>(initialBoardState.data || []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const jsonData: AppData = {
        data: board
      };
      const saveData = JSON.stringify(jsonData);
      localStorage.setItem("BoardData", saveData);
    }
  }, [board]);

  const onListAdded = () => {
    const filename = uuidv1();
    setBoard(prev => {
      const saveData: BoardState = [...prev, { list: [], filename, title: "" }];
      return saveData;
    });
  };

  const onListDeleted = (targetFilename: string) => () => {
    setBoard(prev => {
      const saveData = prev.filter(
        target => target.filename !== targetFilename
      );
      return saveData;
    });
  };

  const onListTitleChanged = (index: number, value: string) => {
    setBoard(prev => {
      const saveData = prev.slice(0, prev.length);
      saveData[index].title = value;
      return saveData;
    });
  };

  const onCardAdded = (index: number) => {
    setBoard(prev => {
      const filename = uuidv1();
      const saveData = prev.slice(0, prev.length);
      saveData[index].list.push({ filename, text: "" });
      return saveData;
    });
  };

  const onCardDeleted = (listIndex: number, cardIndex: number) => {
    setBoard(prev => {
      const saveData = prev.slice(0, prev.length);
      saveData[listIndex].list.splice(cardIndex, 1);
      return saveData;
    });
  };

  const onCardTextChanged = (
    targetListIndex: number,
    targetCardIndex: number,
    cardText: string
  ) => {
    setBoard(prev => {
      const saveData = prev.slice(0, prev.length);
      const target = saveData[targetListIndex].list[targetCardIndex];
      target.text = cardText;
      return saveData;
    });
  };

  const onDragEnded = (result: DropResult) => {
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
      case "List":
        setBoard(prev => {
          const targetListIndex = prev.findIndex(
            target => target.filename === draggableId
          );
          const targetCardList = prev[targetListIndex].list;
          const targetTitle = prev[targetListIndex].title;
          const dropResult = prev.filter(
            target => target.filename !== draggableId
          );
          dropResult.splice(destination.index, 0, {
            list: targetCardList,
            filename: draggableId,
            title: targetTitle
          });
          return dropResult;
        });
        break;
      case "Card":
        setBoard(prev => {
          const sourceListIndex = prev.findIndex(
            target => target.filename === source.droppableId
          );
          const destinationListIndex = prev.findIndex(
            target => target.filename === destination.droppableId
          );
          const saveData = prev.slice(0, prev.length);

          if (sourceListIndex === destinationListIndex) {
            const targetCardIndex = prev[destinationListIndex].list.findIndex(
              target => target.filename === draggableId
            );
            const targetText =
              prev[destinationListIndex].list[targetCardIndex].text;

            const dropResult = prev[destinationListIndex].list.filter(
              target => target.filename !== draggableId
            );
            dropResult.splice(destination.index, 0, {
              filename: draggableId,
              text: targetText
            });
            saveData[destinationListIndex].list = dropResult;
            return saveData;
          }

          const { text } = prev[sourceListIndex].list[source.index];
          const dropSource = prev[sourceListIndex].list.filter(
            target => target.filename !== draggableId
          );
          saveData[sourceListIndex].list = dropSource;
          saveData[destinationListIndex].list.splice(destination.index, 0, {
            filename: draggableId,
            text
          });
          return saveData;
        });
        break;
      default:
        break;
    }
  };

  return {
    board,
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
