import React, { useCallback, useEffect, useState, useRef } from "react";
import Paper from "@material-ui/core/Paper";
import styled from "styled-components";
import CardEditor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-markdown";
import Markdown from "markdown-to-jsx";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import { Draggable } from "react-beautiful-dnd";
import DB, { CardTable } from "../../DB";

interface Props {
  boardId: number;
  listId: number;
  cardIndex: number;
  setCards: React.Dispatch<React.SetStateAction<CardTable[]>>;
}

const KanbanCard: React.FC<Props> = props => {
  const isInitialMount = useRef(true);

  const { boardId, cardIndex, listId, setCards } = props;

  const [isDeleting, setIsDeleting] = useState(false);
  const [isInputArea, setIsInputArea] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    DB.cardTable
      .where("listId")
      .equals(listId)
      .first()
      .then(data => {
        if (!data) {
          throw new Error("List not found.");
        }

        setText(data.text);
      })
      .catch(err => {
        throw err;
      });

    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      const updatedTimestamp = Date.now();
      DB.boardTable.update(boardId, { updatedTimestamp });
    }
  }, [text]);

  const promiseCardId = () => {
    return DB.cardTable
      .where("listId")
      .equals(listId)
      .and(target => target.index === cardIndex)
      .first(data => {
        if (data && data.id) {
          return data.id;
        }

        throw new Error("Card not found.");
      })
      .catch(err => {
        throw err;
      });
  };

  useCallback(async () => {
    const cardId = await promiseCardId();

    DB.cardTable
      .update(cardId, { text })
      .then(() => {
        DB.cardTable
          .toArray()
          .then(data => setCards(data))
          .catch(err => {
            throw err;
          });
      })
      .catch(err => {
        throw err;
      });
  }, [isDeleting]);

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleOnValueChanged = (value: string) => {
    setText(value);
  };

  const onDeleteCardCompleted = () => {
    DB.cardTable
      .where("listId")
      .equals(listId)
      .sortBy("index")
      .then(data => {
        for (let index = 0; index < data.length; index += 1) {
          const { id } = data[index];
          if (!id) {
            throw new Error("Card not found.");
          }
          DB.cardTable.update(id, { index }).catch(err => {
            throw err;
          });
        }
      })
      .catch(err => {
        throw err;
      });
  };

  const handleDeleteButtonClicked = async () => {
    setIsDeleting(true);
    const cardId = await promiseCardId();
    DB.cardTable
      .delete(cardId)
      .then(() => {
        onDeleteCardCompleted();
        setIsDeleting(false);
      })
      .catch(err => {
        throw err;
      });
  };

  const RenderDraggableCard = async () => {
    const cardId = await promiseCardId();

    return (
      <Draggable draggableId={`${cardId}`} index={cardIndex}>
        {provided => (
          <StyledPaper
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
          >
            <StyledCardContentDiv onClick={handleisInputAreaChange}>
              <Markdown>{text}</Markdown>
            </StyledCardContentDiv>
          </StyledPaper>
        )}
      </Draggable>
    );
  };

  return (
    <>
      {isInputArea ? (
        <div>
          <StyledPaper>
            <StyledCodeEditor
              value={text}
              onValueChange={handleOnValueChanged}
              highlight={code => highlight(code, languages.markdown, "md")}
              padding={10}
              autoFocus
            />
          </StyledPaper>
          <StyledButtonArea>
            <Fab
              color="secondary"
              aria-label="OK"
              onClick={handleisInputAreaChange}
            >
              <CheckIcon />
            </Fab>
            <Fab
              color="secondary"
              aria-label="Delete"
              onClick={handleDeleteButtonClicked}
            >
              <DeleteIcon />
            </Fab>
          </StyledButtonArea>
        </div>
      ) : (
        <RenderDraggableCard />
      )}
    </>
  );
};

const StyledPaper = styled(Paper)`
  padding: 0px;
  margin: 8px;
  cursor: pointer;
`;

const StyledCodeEditor = styled(CardEditor)`
  font-family: '"Fira code", "Fira Mono", monospace';
  font-size: 12;
  min-height: 72px;
`;

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin: 8px 0px;
`;

const StyledCardContentDiv = styled.div`
  width: 100%;
  min-height: 72px;
  white-space: pre-line;
`;

export default KanbanCard;
