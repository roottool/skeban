import React from "react";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import styled from "styled-components";
import KanbanCardList from "../KanbanCardList";

const KanbanBoard: React.FC = () => {
  return (
    <StyledKanbanBoard>
      <KanbanCardList />
      <Fab color="primary" aria-label="Add">
        <AddIcon />
      </Fab>
    </StyledKanbanBoard>
  );
};

const StyledKanbanBoard = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 8px 0px;
`;

export default KanbanBoard;
