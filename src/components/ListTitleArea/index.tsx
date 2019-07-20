import React, { useCallback, useEffect, useState, useRef } from "react";
import TextField from "@material-ui/core/TextField";
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import { Typography } from "@material-ui/core";
import DB, { ListTable } from "../../DB";

interface Props {
  boardId: number;
  listId: number;
  setLists: React.Dispatch<React.SetStateAction<ListTable[]>>;
}

const KanbanCardListTitleArea: React.FC<Props> = props => {
  const isInitialMount = useRef(true);

  const { boardId, listId, setLists } = props;

  const [isInputArea, setIsInputArea] = useState(false);
  const [title, setTitle] = useState("");

  const setListsWrapper = useCallback(() => {
    DB.listTable
      .update(listId, { title })
      .then(() => {
        DB.listTable
          .toArray()
          .then(data => setLists(data))
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  }, [title]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      DB.listTable
        .where("id")
        .equals(listId)
        .first()
        .then(data => {
          if (!data) {
            throw new Error("List not found.");
          }

          setTitle(data.title);
        })
        .catch(err => {
          throw err;
        });
    } else {
      setListsWrapper();
    }
  }, [title]);

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleCardTitleChanged = (
    event: React.ChangeEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
    >
  ) => {
    setTitle(event.target.value);
  };

  const handleKeyPressed = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter") {
      handleisInputAreaChange();
    }
  };

  const onDeleteListCompleted = () => {
    DB.listTable
      .where("boardId")
      .equals(boardId)
      .sortBy("index")
      .then(data => {
        const allPromise = [];

        for (let index = 0; index < data.length; index += 1) {
          const { id } = data[index];
          if (!id) {
            throw new Error("List not found.");
          }
          allPromise.push(
            DB.listTable.update(id, { index }).catch(err => {
              throw err;
            })
          );
        }

        Promise.all(allPromise).then(() => {
          DB.listTable
            .where("boardId")
            .equals(boardId)
            .sortBy("index")
            .then(lists => setLists(lists))
            .catch(err => {
              throw err;
            });
        });
      })
      .catch(err => {
        throw err;
      });
  };

  const handleDeleteButtonClicked = () => {
    DB.listTable
      .delete(listId)
      .then(() => {
        onDeleteListCompleted();
      })
      .catch(err => {
        throw err;
      });
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
