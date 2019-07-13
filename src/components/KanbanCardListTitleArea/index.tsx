import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";

const KanbanCardListTitleArea: React.FC = () => {
  const [isInputArea, setIsInputArea] = useState(false);
  const [cardTitle, setCardTitle] = useState("test");

  const handleCardTitleChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardTitle(event.target.value);
  };

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  return (
    <StyledCardListTitleArea>
      {isInputArea ? (
        <StyledCardTitleForm>
          <StyledCardTitleTextField
            id="card-list-name"
            label="Card Title"
            value={cardTitle}
            margin="normal"
            autoFocus
            onChange={handleCardTitleChanged}
            onKeyPress={handleKeyPressed}
            onBlur={handleisInputAreaChange}
          />
        </StyledCardTitleForm>
      ) : (
        <StyledCardTitleDiv onClick={handleisInputAreaChange}>
          <Typography variant="h6" gutterBottom>
            {cardTitle}
          </Typography>
        </StyledCardTitleDiv>
      )}
      <StyledEditIconArea>
        <DeleteIcon fontSize="large" />
      </StyledEditIconArea>
    </StyledCardListTitleArea>
  );
};

const StyledCardListTitleArea = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const StyledCardTitleForm = styled.form`
  flex-basis: 80%;
  margin-left: 8px;
`;

const StyledCardTitleTextField = styled(TextField)`
  width: 100%;
`;

const StyledCardTitleDiv = styled.div`
  flex-basis: 80%;
  margin-left: 8px;
  min-height: 72px;
  display: flex;
  align-items: center;
  word-break: break-word;
  cursor: pointer;
`;

const StyledEditIconArea = styled.div`
  flex-basis: 20%;
  text-align: center;
`;

export default KanbanCardListTitleArea;
