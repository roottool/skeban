import React from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";

const KanbanCardList: React.FC = () => {
  return (
    <StyledPaper>
      <KanbanCardListTitleArea />
      <KanbanCard />
      <StyledAddButtonArea>
        <Fab color="secondary" aria-label="Add">
          <AddIcon />
        </Fab>
      </StyledAddButtonArea>
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;
