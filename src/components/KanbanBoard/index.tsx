import React, { useState } from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import KanbanCardList from "../KanbanCardList";

const KanbanBoard: React.FC = () => {
  const [kanbanCardList, setKanbanCardList] = useState<{ filename: string }[]>(
    []
  );

  const handleAddButtonClicked = () => {
    setKanbanCardList([
      ...kanbanCardList,
      { filename: Math.random().toString() }
    ]);
  };

  return (
    <StyledKanbanBoard>
      <KanbanCardList />
      {kanbanCardList.map(cardList => (
        <KanbanCardList key={cardList.filename} />
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
