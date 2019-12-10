import React, { useState } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Controlled as CodeMirror } from "react-codemirror2";
import unified from "unified";
import parse2Markdown from "remark-parse";
import remark2rehype from "remark-rehype";
import highlight from "rehype-highlight";
import rehype2react from "rehype-react";
import MaterialCard from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Fab from "@material-ui/core/Fab";
import CheckIcon from "@material-ui/icons/Check";
import DeleteIcon from "@material-ui/icons/Delete";
import State from "../../State";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/mode/javascript/javascript";
import "highlight.js/styles/default.css";

interface Props {
  boardId: number;
  cardId: number;
  cardIndex: number;
}

const processor = unified()
  .use(parse2Markdown)
  .use(remark2rehype)
  .use(highlight)
  .use(rehype2react, { createElement: React.createElement });

const Card: React.FC<Props> = props => {
  const { boardId, cardId, cardIndex } = props;

  const Container = State.useContainer();
  const [isInputArea, setIsInputArea] = useState(false);

  const card = Container.allCards.find(cardData => cardData.id === cardId);
  const cardText = card?.text || "";
  const [text, setValue] = useState(cardText);

  const handleisInputAreaChange = () => {
    if (isInputArea) {
      Container.onCardTextChanged(boardId, cardId, text);
    }
    setIsInputArea(!isInputArea);
  };

  const handleValueChanged = (value: string) => {
    setValue(value);
  };

  const handleDeleteButtonClicked = () => {
    Container.onCardDeleted(boardId, cardId);
  };

  return (
    <>
      {isInputArea ? (
        <>
          <StyledCard>
            <CodeMirror
              value={text}
              options={{
                autoFocus: true,
                mode: "markdown",
                theme: "default",
                lineNumbers: true
              }}
              onBeforeChange={(value: string) => {
                handleValueChanged(value);
              }}
            />
          </StyledCard>
          <StyledButtonArea>
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
            <Fab
              variant="extended"
              size="medium"
              color="secondary"
              aria-label="Delete this card"
              onClick={handleDeleteButtonClicked}
            >
              <DeleteIcon />
              DELETE THIS CARD
            </Fab>
          </StyledButtonArea>
        </>
      ) : (
        <Draggable draggableId={`cardId-${cardId}`} index={cardIndex}>
          {provided => (
            <StyledCard
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <CardContent>
                <StyledCardContentDiv onClick={handleisInputAreaChange}>
                  {processor.processSync(text).contents}
                </StyledCardContentDiv>
              </CardContent>
            </StyledCard>
          )}
        </Draggable>
      )}
    </>
  );
};

const StyledCard = styled(MaterialCard)`
  padding: 0px;
  margin: 8px 16px;
`;

const StyledButtonArea = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  margin-bottom: 16px;
`;

const StyledCardContentDiv = styled.div`
  width: 100%;
  min-height: 72px;
  white-space: pre-line;
`;

export default Card;
