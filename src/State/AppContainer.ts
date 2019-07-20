import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import uuidv1 from "uuid/v1";
import { DropResult } from "react-beautiful-dnd";

interface App {
  boards: Board[];
  filename: string;
}

interface Board {
  filename: string;
}

interface BoardDetail {
  createdBoard: number;
  filename: string;
  lists: List[];
  title: string;
  updatedBoard: number;
}

interface List {
  filename: string;
}

interface ListDetail {
  cards: Card[];
  filename: string;
  title: string;
}

interface Card {
  filename: string;
}

interface CardDetail extends Card {
  text: string;
}

type AllBoardState = Board[];
type AllBoardDetailState = BoardDetail[];
type AllListState = List[];
type AllListDetailState = ListDetail[];
type AllCardState = Card[];
type AllCardDetailState = CardDetail[];

type localStorageActionType = "SAVE" | "GET" | "REMOVE";

const appStateFilename = "appState";

const parseJson = (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (err) {
    throw err;
  }
};

const jsonStringify = (json: Object) => {
  try {
    return JSON.stringify(json);
  } catch (err) {
    throw err;
  }
};

const localStorageActionWrapper = (
  type: localStorageActionType,
  filename: string,
  value?: string
) => {
  switch (type) {
    case "SAVE":
      if (!value) {
        throw new Error("Value is undefined.");
      }
      localStorage.setItem(filename, value);
      break;
    case "GET":
      return localStorage.getItem(filename);
    case "REMOVE":
      localStorage.removeItem(filename);
      break;
    default:
      break;
  }
  return undefined;
};

const useStore = () => {
  const [app, setApp] = useState<App>(() => {
    const initialAppStateJson = localStorageActionWrapper(
      "GET",
      appStateFilename
    );
    let result: App = { boards: [], filename: appStateFilename };
    if (initialAppStateJson) {
      result = parseJson(initialAppStateJson);
    }
    if (result && result.boards.length > 0) {
      return result;
    }
    const filename = uuidv1();
    result = {
      boards: [{ filename }],
      filename: appStateFilename
    };
    localStorageActionWrapper("SAVE", appStateFilename, jsonStringify(result));
    return result;
  });

  const [allBoard, setAllBoard] = useState<AllBoardState>(() => {
    const result: AllBoardState = [];
    app.boards.forEach(target => {
      result.push(target);
    });
    return result;
  });

  const [allBoardDetail, setAllBoardDetail] = useState<AllBoardDetailState>(
    () => {
      let result: AllBoardDetailState = [];
      allBoard.forEach(board => {
        const initialAllBoardDetailStateJson = localStorageActionWrapper(
          "GET",
          board.filename
        );
        if (initialAllBoardDetailStateJson) {
          const jsonData = parseJson(initialAllBoardDetailStateJson);
          result = result.concat(jsonData);
        } else {
          const createdTimestamp = Date.now();
          result.push({
            createdBoard: createdTimestamp,
            filename: board.filename,
            lists: [],
            title: "",
            updatedBoard: createdTimestamp
          });
        }
      });
      return result;
    }
  );

  const [allList, setAllList] = useState<AllListState>(() => {
    const result: AllListState = [];
    allBoardDetail.forEach(board => {
      if (board.lists.length > 0) {
        board.lists.forEach(list => {
          result.push(list);
        });
      }
    });
    return result;
  });

  const [allListDetail, setAllListDetail] = useState<AllListDetailState>(() => {
    let result: AllListDetailState = [];
    allList.forEach(target => {
      const initialAllListDetailStateJson = localStorageActionWrapper(
        "GET",
        target.filename
      );
      if (initialAllListDetailStateJson) {
        const jsonData = parseJson(initialAllListDetailStateJson);
        result = result.concat(jsonData);
      }
    });
    return result;
  });

  const [allCard, setAllCard] = useState<AllCardState>(() => {
    const result: AllCardState = [];
    allListDetail.forEach(list => {
      if (list.cards.length > 0) {
        list.cards.forEach(card => {
          result.push(card);
        });
      }
    });
    return result;
  });

  const [allCardDetail, setAllCardDetail] = useState<AllCardDetailState>(() => {
    let result: AllCardDetailState = [];
    allCard.forEach(target => {
      const initialAllCardDetailStateJson = localStorageActionWrapper(
        "GET",
        target.filename
      );
      if (initialAllCardDetailStateJson) {
        const jsonData = parseJson(initialAllCardDetailStateJson);
        result = result.concat(jsonData);
      }
    });
    return result;
  });

  useEffect(() => {
    setApp(prev => {
      const saveData = Object.assign({}, prev);
      saveData.boards = allBoard;
      localStorageActionWrapper(
        "SAVE",
        appStateFilename,
        jsonStringify(saveData)
      );
      return saveData;
    });
  }, [allBoard]);

  const onBoardAdded = () => {
    const filename = uuidv1();
    setAllBoard(prev => {
      const saveData: AllBoardState = [
        ...prev,
        {
          filename
        }
      ];
      return saveData;
    });
    setAllBoardDetail(prev => {
      const createdTimestamp = Date.now();
      const saveFileData: BoardDetail = {
        createdBoard: createdTimestamp,
        filename,
        lists: [],
        title: "",
        updatedBoard: createdTimestamp
      };
      const saveState: AllBoardDetailState = [...prev, saveFileData];
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveFileData));
      return saveState;
    });
  };

  const onListAdded = (targetIndex: number) => {
    const newFilename = uuidv1();
    setAllBoardDetail(prev => {
      const { createdBoard, filename, lists, title } = prev[targetIndex];
      const saveData: AllBoardDetailState = prev.slice(0, prev.length);
      const updatedTimestamp = Date.now();
      saveData.splice(targetIndex, 1, {
        createdBoard,
        filename,
        lists: [...lists, { filename: newFilename }],
        title,
        updatedBoard: updatedTimestamp
      });
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
      return saveData;
    });
    setAllList(prev => {
      const saveData: AllListState = [...prev, { filename: newFilename }];
      return saveData;
    });
    setAllListDetail(prev => {
      const saveData: AllListDetailState = [
        ...prev,
        { filename: newFilename, cards: [], title: "" }
      ];
      localStorageActionWrapper("SAVE", newFilename, jsonStringify(saveData));
      return saveData;
    });
  };

  const onListDeleted = (targetFilename: string, targetIndex: number) => {
    setAllBoardDetail(prev => {
      const { filename, lists } = prev[targetIndex];
      const saveData = prev.slice(0, prev.length);
      saveData[targetIndex].lists = lists.filter(
        target => target.filename !== targetFilename
      );
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
      return saveData;
    });
    setAllList(prev => {
      const saveData = prev.filter(
        target => target.filename !== targetFilename
      );
      return saveData;
    });
    setAllListDetail(prev => {
      const index = prev.findIndex(
        target => target.filename !== targetFilename
      );
      if (index >= 0) {
        prev[index].cards.forEach(target => {
          localStorageActionWrapper("REMOVE", target.filename);
        });
      }

      const saveData = prev.filter(
        target => target.filename !== targetFilename
      );
      localStorageActionWrapper("REMOVE", targetFilename);
      return saveData;
    });
  };

  const onListTitleChanged = (
    filename: string,
    index: number,
    value: string
  ) => {
    setAllListDetail(prev => {
      const saveState = prev.slice(0, prev.length);
      const saveFileData: ListDetail = {
        cards: prev[index].cards,
        filename,
        title: value
      };
      saveState.splice(index, 1, saveFileData);
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveFileData));
      return saveState;
    });
  };

  const onCardAdded = (targetIndex: number) => {
    const newFilename = uuidv1();
    setAllListDetail(prev => {
      const { cards, filename, title } = prev[targetIndex];
      const saveData = prev.slice(0, prev.length);
      saveData.splice(targetIndex, 1, {
        cards: [...cards, { filename: newFilename }],
        filename,
        title
      });
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
      return saveData;
    });
    setAllCard(prev => {
      const saveData: AllCardState = [...prev, { filename: newFilename }];
      return saveData;
    });
    setAllCardDetail(prev => {
      const saveData: AllCardDetailState = [
        ...prev,
        { filename: newFilename, text: "" }
      ];
      localStorageActionWrapper("SAVE", newFilename, jsonStringify(saveData));
      return saveData;
    });
  };

  const onCardDeleted = (targetFilename: string, targetIndex: number) => {
    setAllListDetail(prev => {
      const { cards, filename } = prev[targetIndex];
      const saveData = prev.slice(0, prev.length);
      saveData[targetIndex].cards = cards.filter(
        target => target.filename !== targetFilename
      );
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveData));
      return saveData;
    });
    setAllCard(prev => {
      const saveData = prev.filter(
        target => target.filename !== targetFilename
      );
      return saveData;
    });
    setAllCardDetail(prev => {
      const saveData = prev.filter(
        target => target.filename !== targetFilename
      );
      localStorageActionWrapper("REMOVE", targetFilename);
      return saveData;
    });
  };

  const onCardTextChanged = (
    filename: string,
    index: number,
    value: string
  ) => {
    setAllCardDetail(prev => {
      const saveState = prev.slice(0, prev.length);
      const saveFileData: CardDetail = { filename, text: value };
      saveState.splice(index, 1, saveFileData);
      localStorageActionWrapper("SAVE", filename, jsonStringify(saveFileData));
      return saveState;
    });
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
      case "List":
        setAllBoardDetail(prev => {
          const targetBoardIndex = prev.findIndex(
            target => target.filename === destination.droppableId
          );
          const saveState = prev.slice(0, prev.length);
          const { lists } = saveState[targetBoardIndex];
          lists.splice(source.index, 1);
          lists.splice(destination.index, 0, {
            filename: draggableId
          });
          const updatedTimestamp = Date.now();
          saveState[targetBoardIndex].updatedBoard = updatedTimestamp;
          localStorageActionWrapper(
            "SAVE",
            saveState[targetBoardIndex].filename,
            jsonStringify(saveState)
          );
          return saveState;
        });
        break;
      case "Card":
        setAllListDetail(prev => {
          const sourceListIndex = prev.findIndex(
            target => target.filename === source.droppableId
          );
          const destinationListIndex = prev.findIndex(
            target => target.filename === destination.droppableId
          );
          const saveState = prev.slice(0, prev.length);
          const saveFileData: Card = {
            filename: draggableId
          };
          saveState[sourceListIndex].cards.splice(source.index, 1);
          saveState[destinationListIndex].cards.splice(
            destination.index,
            0,
            saveFileData
          );
          localStorageActionWrapper(
            "SAVE",
            draggableId,
            jsonStringify(saveFileData)
          );
          return saveState;
        });
        break;
      default:
        break;
    }
  };

  return {
    allBoard,
    allBoardDetail,
    allList,
    allListDetail,
    allCard,
    allCardDetail,
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
