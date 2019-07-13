import React from "react";
import styled from "styled-components";
import Paper from "@material-ui/core/Paper";
import CardListTitleArea from "../CardListTitleArea";

const CardList: React.FC = () => {
  return (
    <StyledPaper>
      <CardListTitleArea />
    </StyledPaper>
  );
};

const StyledPaper = styled(Paper)`
  width: 360px;
`;

export default CardList;
