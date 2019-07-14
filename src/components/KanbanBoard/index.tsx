import React, { useEffect, useRef, useState } from "react";
import uuidv1 from "uuid/v1";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import KanbanCardList from "../KanbanCardList";

interface KanbanCardListState {
  filename: string;
}

interface KanbanCardListData {
  data: KanbanCardListState[];
}

const KanbanBoard: React.FC = () => {
  const isInitialMount = useRef(true);
  const initialJsonData = localStorage.getItem("BoardData") || "{}";
  const initialBoard: KanbanCardListData = JSON.parse(initialJsonData);

  const [kanbanCardList, setKanbanCardList] = useState<KanbanCardListState[]>(
    initialBoard.data || []
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const jsonData: KanbanCardListData = {
        data: kanbanCardList
      };
      const saveData = JSON.stringify(jsonData);
      localStorage.setItem("BoardData", saveData);
    }
  }, [kanbanCardList]);

  const deleteKanbanCardList = (filename: string) => {
    setKanbanCardList(prev => {
      return prev.filter(target => target.filename !== filename);
    });
  };

  const handleAddButtonClicked = async () => {
    setKanbanCardList(prev => [...prev, { filename: uuidv1() }]);
  };

  return (
    <StyledKanbanBoard>
      {kanbanCardList.map(cardList => (
        <KanbanCardList
          key={cardList.filename}
          filename={cardList.filename}
          handleKanbanCardListDelete={deleteKanbanCardList}
        />
      ))}
      <StyledAddbuttonArea>
        <Fab color="primary" aria-label="Add" onClick={handleAddButtonClicked}>
          <AddIcon />
        </Fab>
      </StyledAddbuttonArea>
    </StyledKanbanBoard>
  );
};

const StyledKanbanBoard = styled.div`
  display: flex;
  margin: 8px 0px;
`;

const StyledAddbuttonArea = styled.div`
  flex: 0 0 360px;
  text-align: center;
  margin-top: 16px;
`;

export default KanbanBoard;
