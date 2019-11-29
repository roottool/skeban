import React, { useState } from "react";
import styled from "styled-components";
import TextField from "@material-ui/core/TextField";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import Typography from "@material-ui/core/Typography";
import State from "../../State";

interface Props {
  boardId: number;
  listId: number;
}

const ListTitleArea: React.FC<Props> = props => {
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

  const handleListTitleChanged = (
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

  return (
    <StyledListTitleArea>
      {isInputArea ? (
        <StyledListTitleForm>
          <StyledListTitleTextField
            id="list-name"
            label="Card Title"
            value={title}
            margin="normal"
            autoFocus
            onChange={handleListTitleChanged}
            onKeyPress={handleKeyPressed}
            onBlur={handleisInputAreaChange}
          />
        </StyledListTitleForm>
      ) : (
        <StyledListTitleDiv onClick={handleisInputAreaChange}>
          <StyledListTitleTypography variant="h6" gutterBottom>
            {title || "The title is empty"}
          </StyledListTitleTypography>
        </StyledListTitleDiv>
      )}
      {isInputArea && (
        <StyledEditIconArea>
          <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="DONE"
            onClick={handleisInputAreaChange}
          >
            <CheckIcon />
            DONE
          </Fab>
        </StyledEditIconArea>
      )}
    </StyledListTitleArea>
  );
};

const StyledListTitleArea = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`;

const StyledListTitleForm = styled.form`
  flex-basis: 80%;
  margin-left: 8px;
`;

const StyledListTitleTextField = styled(TextField)`
  width: 100%;
`;

const StyledListTitleDiv = styled.div`
  flex-basis: 80%;
  margin-left: 8px;
  min-height: 72px;
  display: flex;
  align-items: center;
  word-break: break-word;
  cursor: pointer;
`;

const StyledListTitleTypography = styled(Typography)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const StyledEditIconArea = styled.div`
  flex-basis: 20%;
  text-align: center;
  margin: 0 16px;
`;

export default ListTitleArea;
