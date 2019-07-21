import React, { useState } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";
import State from "../../State";

interface Props {
  boardId: number;
  listId: number;
}

const KanbanCardListTitleArea: React.FC<Props> = props => {
  const { boardId, listId } = props;

  const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);

  const list = Container.allLists
    .filter(listData => listData.id === listId)
    .pop();
  const title = list ? list.title : "";

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleCardTitleChanged = (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    Container.onListTitleChanged(boardId, listId, event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  const handleDeleteButtonClicked = () => {
    Container.onListDeleted(boardId, listId);
  };

  return (
    <StyledCardListTitleArea>
      {isInputArea ? (
        <StyledCardTitleForm>
          <StyledCardTitleTextField
            id="card-list-name"
            label="Card Title"
            value={title}
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
            {title || "The title is empty"}
          </Typography>
        </StyledCardTitleDiv>
      )}
      {isInputArea && (
        <StyledEditIconArea>
          <IconButton
            aria-label="Done"
            color="primary"
            onClick={handleisInputAreaChange}
          >
            <CheckIcon fontSize="large" />
          </IconButton>
        </StyledEditIconArea>
      )}
      <StyledEditIconArea>
        <IconButton
          aria-label="Delete"
          color="primary"
          onClick={handleDeleteButtonClicked}
        >
          <DeleteIcon fontSize="large" />
        </IconButton>
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
