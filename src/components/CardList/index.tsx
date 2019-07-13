import React from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import CardListTitleArea from "../CardListTitleArea";

const CardList: React.FC = () => {
  return (
    <StyledPaper>
      <CardListTitleArea />
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
  margin-top: 4px;
  margin-bottom: 8px;
`;

export default CardList;
