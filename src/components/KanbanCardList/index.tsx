import React, { useState } from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import KanbanCardListTitleArea from "../KanbanCardListTitleArea";
import KanbanCard from "../KanbanCard";

const KanbanCardList: React.FC = () => {
  const [cardList, setCardList] = useState<{ filename: string }[]>([]);

  const handleAddButtonClicked = () => {
    setCardList([...cardList, { filename: Math.random().toString() }]);
  };

  return (
    <StyledPaper>
      <KanbanCardListTitleArea />
      {cardList.map(card => (
        <KanbanCard key={card.filename} />
      ))}
      <StyledAddButtonArea>
        <Fab
          color="secondary"
          aria-label="Add"
          onClick={handleAddButtonClicked}
        >
          <AddIcon />
        </Fab>
      </StyledAddButtonArea>
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
  flex: 0 0 360px;
  margin: 16px;
`;

const StyledAddButtonArea = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

export default KanbanCardList;
