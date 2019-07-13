import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import EditIcon from "@material-ui/icons/Edit";
import { Typography } from "@material-ui/core";

const CardListTitleArea: React.FC = () => {
  const [isInputTextArea, setIsInputTextArea] = useState(false);
  const [cardTitle, setCardTitle] = useState("test");

  const handleCardTitleChanged = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCardTitle(event.target.value);
  };

  const handleButtonClicked = () => {
    setIsInputTextArea(!isInputTextArea);
  };

  return (
    <StyledCardListTitleArea>
      {isInputTextArea ? (
        <StyledCardTitleForm>
          <StyledCardTitleTextField
            id="card-list-name"
            label="Card Title"
            value={cardTitle}
            onChange={handleCardTitleChanged}
            margin="normal"
          />
        </StyledCardTitleForm>
      ) : (
        <StyledCardTitleDiv>
          <Typography variant="h6" gutterBottom>
            {cardTitle}
          </Typography>
        </StyledCardTitleDiv>
      )}
      <StyledEditIconArea>
        <EditIcon fontSize="large" onClick={handleButtonClicked} />
      </StyledEditIconArea>
    </StyledCardListTitleArea>
  );
};

const StyledCardListTitleArea = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
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
`;

const StyledEditIconArea = styled.div`
  flex-basis: 20%;
  text-align: center;
`;

export default CardListTitleArea;
