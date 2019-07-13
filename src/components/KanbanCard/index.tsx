import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import styled from "styled-components";

const KanbanCard: React.FC = () => {
  return (
    <StlyedCard>
      <CardContent>test</CardContent>
    </StlyedCard>
  );
};

const StlyedCard = styled(Card)`
  margin: 8px;
  cursor: pointer;
`;

export default KanbanCard;
