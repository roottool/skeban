import React, { useState } from "react";
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
import State from "../../State";

interface Props {
  boardId: number;
  cardId: number;
  cardIndex: number;
}

const KanbanCard: React.FC<Props> = props => {
  const { boardId, cardId, cardIndex } = props;

  const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);

  const card = Container.allCards
    .filter(cardData => cardData.id === cardId)
    .pop();
  const text = card ? card.text : "";

  const handleisInputAreaChange = () => {
    setIsInputArea(!isInputArea);
  };

  const handleValueChanged = (value: string) => {
    Container.onCardTextChanged(boardId, cardId, value);
  };

  const handleDeleteButtonClicked = () => {
    Container.onCardDeleted(boardId, cardId);
  };

  return (
    <>
      {isInputArea ? (
        <div>
          <StyledPaper>
            <StyledCodeEditor
              value={text}
              onValueChange={handleValueChanged}
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
